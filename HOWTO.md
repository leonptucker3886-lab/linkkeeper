# How to use LinkKeeper (v0.2 beta)

1. Open https://linkkeeper.leonlink.net (fallback: https://linkkeeper-goodbyedawg-7221s-projects.vercel.app).
2. Paste a page address (e.g. https://leonlink.net/) and click **Scan**.
3. Wait up to 30 seconds. Up to 60 links on that page are checked.
4. Read the results:
   - **Score**: 100, minus 10 per dead link, 25 for a missing disclosure, 5 per SEO gap, 5 per untagged Amazon link.
   - **Dead links**: 404/410/5xx or no reply. Fix or remove them.
   - **Blocked / unverified**: sites that refuse bots (403/429/503, common on Amazon). Not counted as dead; check by hand.
   - **Amazon links missing your tag**: Amazon product links with no `tag=`, so you earn nothing. Each costs 5 points.
   - **Redirects to another site**: non-affiliate links that now land on a different domain (moved or hijacked pages).
   - **Affiliate disclosure**: pages with affiliate links (Amazon tag=, amzn.to, ShareASale...) must show a disclosure.
   - **SEO gaps**: title, meta description, canonical, og tags, H1 count, image alt text.
   - **All links**: every link and its status; `$` marks affiliate links.
5. Click **Download report (CSV)** to save the list.

API: `GET /api/scan?url=<page>` returns JSON (score, dead, disclosure, seo.issues, links).

Limits: one page per scan, 60 links max, some sites block bots (shows as 403/no reply). Auto-fix pull requests come in Phase 3.
