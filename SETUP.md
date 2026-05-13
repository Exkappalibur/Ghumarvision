# Eurovision SF2 Pool — Setup

About 10 minutes total. Three pieces: a Google Sheet (storage + admin view), an Apps Script (the backend), and the HTML form (what friends see).

## 1. Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) — a new blank sheet opens.
2. Name it something like **Eurovision SF2 Pool**.
3. That's it. Don't add columns — the script writes them on first submission.

## 2. Add the Apps Script backend

1. In the sheet, click **Extensions → Apps Script**.
2. Delete the default `function myFunction() {}` placeholder.
3. Open `apps-script.gs` (the file I gave you), copy its entire contents, and paste it in.
4. Save (⌘S / Ctrl+S). Name the project whatever — "Eurovision Pool" is fine.

## 3. Deploy the script as a Web App

1. Top right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description**: anything (e.g. "v1")
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ← important, so your friends' browsers can POST
4. Click **Deploy**.
5. Google will ask you to authorize — accept. You may see a "Google hasn't verified this app" warning; click **Advanced → Go to [project name] (unsafe)**. It's your own script writing to your own sheet, it's fine.
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycby...../exec`

**Sanity check:** paste that URL into a browser tab. You should see `{"ok":true,"message":"Eurovision pool endpoint is live."}`. If yes, the backend works.

## 4. Wire up the form

1. Open `index.html` in any text editor.
2. Find this line near the bottom (inside `<script>`):
   ```js
   const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Replace the placeholder with the Web app URL from step 3. Keep the quotes.
4. Save.

## 5. Host the HTML so friends can open it

Easiest free options:

**Netlify Drop** (fastest, ~30 seconds):
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `index.html` onto the page (no account needed for a one-off deploy, though signing up keeps the site around)
3. Netlify gives you a URL like `random-name.netlify.app` — that's the link you send friends

**Other options:** GitHub Pages, Vercel, Cloudflare Pages — all free, all work. Pick whatever you know.

## 6. Test it yourself first

1. Open the hosted URL in an incognito window.
2. Fill out the form and submit.
3. Check your Google Sheet — a row should appear within a second or two.
4. If it does: ship it to friends. If it doesn't: see Troubleshooting below.

## 7. Share with friends

Send the hosted URL. Each friend fills it out once. New submissions appear in your sheet as they come in. Sort, filter, or download as CSV from `File → Download → CSV` whenever you want.

---

## Notes

- **Submission lock**: each browser can only submit once (stored in `localStorage`). A friend who really wants to resubmit could clear site data or use incognito — fine for friends, not bulletproof.
- **Re-deploying after a script change**: if you edit `apps-script.gs`, click **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.
- **Changing the password / restricting access**: anyone with the form URL can submit. If that's a concern, only share the URL with friends. Or add a passphrase field in the form.

## Troubleshooting

**"Couldn't save: Apps Script URL is not configured."**
→ You forgot to paste the URL into `index.html` step 4.

**"Couldn't save: Failed to fetch" or "Server returned 401/403"**
→ The Web app's "Who has access" setting isn't "Anyone." Redo step 3 part 3.

**Submission seems to succeed but nothing shows in the sheet**
→ Make sure the Apps Script is bound to the right sheet (it should be — Extensions → Apps Script opens a script tied to that specific sheet). If you copied script code into a standalone Apps Script project, that won't work; recreate it from inside the sheet.

**Friend can't submit ("already submitted" but they haven't)**
→ Their browser has a stale `localStorage` flag. They can open the link in incognito or clear site data.
