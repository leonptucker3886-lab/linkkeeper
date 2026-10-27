# How to use LinkKeeper (v0.1 beta)

1. Open https://linkkeeper.leonlink.net (fallback: https://linkkeeper.vercel.app).
2. Paste a page address (e.g. https://leonlink.net/) and click **Scan**.
3. Wait up to 30 seconds. Up to 60 links on that page are checked.
4. Read the results:
   - **Score**: 100, minus 10 per dead link, 25 for a missing disclosure, 5 per SEO gap.
   - **Dead links**: error (4xx/5xx) or no reply. Fix or remove them.
   - **Affiliate disclosure**: pages with affiliate links (Amazon tag=, amzn.to, ShareASale...) must show a disclosure.
   - **SEO gaps**: title, meta description, canonical, og tags, H1 count, image alt text.
   - **All links**: every link and its status; `$` marks affiliate links.
5. Click **Download report (CSV)** to save the list.

API: `GET /api/scan?url=<page>` returns JSON (score, dead, disclosure, seo.issues, links).

Limits: one page per scan, 60 links max, some sites block bots (shows as 403/no reply). Auto-fix pull requests come in Phase 3.
