// LinkKeeper v0.2 - scans a page for dead links, affiliate disclosure, SEO gaps.
const AFF=[/amazon\.[a-z.]+\/.*tag=/i,/amzn\.to\//i,/[?&](aff|affid|tag)=/i,/shareasale|awin1|impact\.com|clickbank|rstyle\.me/i];
const DISC=/(affiliate|commission|as an amazon associate|we may earn|paid link|sponsored)/i;
const UA='Mozilla/5.0 (LinkKeeper/0.2)';
async function check(u){const c=new AbortController();const t=setTimeout(()=>c.abort(),8000);
 try{let r=await fetch(u,{method:'HEAD',redirect:'follow',signal:c.signal,headers:{'user-agent':UA}});
  if(r.status>=400&&r.status!==404&&r.status!==410)r=await fetch(u,{redirect:'follow',signal:c.signal,headers:{'user-agent':UA}});
  return{status:r.status,finalUrl:r.url,redirected:r.redirected};}catch(e){return{status:0}}finally{clearTimeout(t)}}
module.exports=async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');
 let url=(req.query&&req.query.url)||'';if(!/^https?:\/\//i.test(url))url='https://'+url;
 let u;try{u=new URL(url)}catch{return res.status(400).json({error:'Invalid URL'})}
 let html;try{const r=await fetch(u,{headers:{'user-agent':UA}});html=await r.text();if(!r.ok)return res.status(502).json({error:'Page returned '+r.status})}catch(e){return res.status(502).json({error:'Could not fetch page'})}
 const text=html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');
 const hrefs=[...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#]+)["']/gi)].map(m=>m[1]).filter(h=>!/^(mailto|tel|javascript):/i.test(h));
 const abs=[...new Set(hrefs.map(h=>{try{return new URL(h,u).href}catch{return null}}).filter(Boolean))].slice(0,60);
 const links=[];for(let i=0;i<abs.length;i+=10)links.push(...await Promise.all(abs.slice(i,i+10).map(async l=>({url:l,affiliate:AFF.some(r=>r.test(l)),...(await check(l))}))));
 const g=re=>{const m=html.match(re);return m?m[1].trim():''};
 const title=g(/<title[^>]*>([\s\S]*?)<\/title>/i),desc=g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
 const seo=[];
 if(!title)seo.push('Missing <title>');else if(title.length>60)seo.push(`Title is ${title.length} chars (aim for 60 or fewer)`);
 if(!desc)seo.push('Missing meta description');else if(desc.length>160)seo.push(`Meta description is ${desc.length} chars (aim for 160 or fewer)`);
 if(!/rel=["']canonical["']/i.test(html))seo.push('Missing canonical link');
 if(!/property=["']og:title["']/i.test(html))seo.push('Missing og:title');
 if(!/property=["']og:image["']/i.test(html))seo.push('Missing og:image');
 const h1=(html.match(/<h1\b/gi)||[]).length;if(h1!==1)seo.push(`Page has ${h1} <h1> tags (should be 1)`);
 const noAlt=(html.match(/<img\b(?![^>]*\balt=)[^>]*>/gi)||[]).length;if(noAlt)seo.push(`${noAlt} image(s) missing alt text`);
 const aff=links.filter(r=>r.affiliate).length,hasDisc=DISC.test(text),blocked=links.filter(r=>[403,429,503,999].includes(r.status)),dead=links.filter(r=>(r.status===0||r.status>=400)&&!blocked.includes(r));
 const untagged=links.filter(r=>/amazon\.[a-z.]+\/(dp|gp)\//i.test(r.url)&&!/[?&]tag=/i.test(r.url)).map(r=>r.url);
 const redirectedOff=links.filter(r=>r.redirected&&r.finalUrl&&new URL(r.finalUrl).hostname.replace(/^www\./,'')!==new URL(r.url).hostname.replace(/^www\./,'')&&!r.affiliate).map(r=>({url:r.url,to:r.finalUrl}));
 res.status(200).json({page:u.href,scannedAt:new Date().toISOString(),linksChecked:links.length,dead,blocked,untaggedAmazon:untagged,redirectedOffsite:redirectedOff,affiliateLinks:aff,
  disclosure:{needed:aff>0,found:hasDisc,ok:aff===0||hasDisc},seo:{title,description:desc,issues:seo},links,
  score:Math.max(0,100-dead.length*10-(aff&&!hasDisc?25:0)-seo.length*5-untagged.length*5)});
};
