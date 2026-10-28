# LinkKeeper Logbook — MAJ Pizzapan

## 2026-10-27 — v0.1 first draft
- Assigned by Commander Leon (Pizzapan idea #2). Rough-draft plan PDF posted in chat.
- Built single-page scanner: `index.html` + `api/scan.js` (Vercel serverless). Checks up to 60 links, affiliate disclosure, SEO gaps; CSV export.
- Deployed: https://linkkeeper-goodbyedawg-7221s-projects.vercel.app (direct deploy; Vercel GitHub app lacks repo access, so pushes don't auto-deploy).
- Test scan of https://leonlink.net/: 90/100, 23 links, 0 dead, 6 Amazon affiliate links, disclosure found; SEO: 260-char meta description, 2 H1s.
- linkkeeper.leonlink.net added in Vercel; waiting on DNS (TXT _vercel + CNAME linkkeeper -> cname.vercel-dns.com).
- Not linked from leonlink.net, per orders.

## 2026-10-27 — Self-review: what can I improve?
1. **False "dead" links.** Amazon and other stores often answer bots with 403/503. v0.1 counted those as dead, which would push wrong fixes. 
2. **Lost commissions not caught.** An Amazon product link without `tag=` earns nothing, and v0.1 did not flag it.
3. **Moved pages not caught.** A link that redirects to a different domain can mean a moved or hijacked page.
4. **HOWTO had a wrong fallback URL** (linkkeeper.vercel.app is not ours).
5. **No logbook** in the repo.

## 2026-10-27 — v0.2 polish
- 403/429/503/999 now reported as "Blocked / unverified", not dead, and not scored.
- New check: Amazon product links missing an affiliate tag (-5 each).
- New check: non-affiliate links redirecting to another domain.
- HOWTO.md fixed and updated; this LOGBOOK.md added.
- Still open: multi-page (sitemap) scans, auto-fix pull requests (Phase 3/4), subdomain DNS.

## 2026-10-27 — v0.2.1 second polish
- Live test on leonlink.net flagged 13 harmless leonlink.net -> www.leonlink.net redirects as "redirects to another site". Now www/apex hops are ignored.
- Re-tested leonlink.net home: 90/100, 23 links, 0 dead, 0 blocked, 0 untagged Amazon links, disclosure found.


## v0.2.2 (2026-10-28)
- Fixed: page titles/descriptions showed raw HTML entities like `&amp;`; scanner now decodes entities and collapses whitespace.
- Fixed: stale banner said "v0.2 rough draft"; now "BETA: LinkKeeper v0.2.2".
