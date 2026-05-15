# Eurovision SF2 Pool

A single-page voting form for predicting Eurovision Semi-Final 2 results. Friends fill it out, submissions land in an Airtable base.

## Stack

- `index.html` — the form (vanilla JS, no build step)
- Hosted on GitHub Pages
- Submissions stored in Airtable

## How it works

The form POSTs directly to the Airtable REST API. The personal access token (PAT) and base/table IDs are embedded in `index.html` (around line 446). The token is scoped to a single base, so exposure is low-risk for a closed pool — worst case someone writes a junk vote.

## Airtable schema

Base: `appqidU0p3t0LmJzK`

### Final Votes (Grand Final — current)

| Field | Type |
|---|---|
| Name | Single line text (primary) |
| Pledged | Checkbox |
| Top 10 | Long text (comma-separated country names) |
| Top 5 | Long text (comma-separated country names) |
| Overall Winner | Single line text |
| Televote Winner | Single line text |
| Jury Winner | Single line text |
| Favorite | Single line text |
| Most Hated | Single line text |
| Most WTF | Single line text |
| Odds Match % | Number |

### Votes (Semi-Final 2 — archive)

The original Semi 2 submissions live in the `Votes` table — left intact for reference.

## Rotating the token

If the token leaks or gets abused:

1. Airtable → Settings → Developer hub → Personal access tokens → revoke the old one
2. Create a new PAT scoped to this base with `data.records:write` (add `data.records:read` and `schema.bases:read/write` if you want to keep editing structure via API)
3. Update `AIRTABLE_TOKEN` in `index.html`, commit, push

## Local dev

Open `index.html` in a browser — `file://` works fine. Submissions go straight to the live Airtable base, so test in a way that's easy to delete after.

## Submission lock

Each browser stores `eurovision_sf2_submitted=1` in `localStorage` after a successful submission and won't show the form again. A friend who really wants to resubmit can clear site data or use incognito — fine for friends, not bulletproof.
