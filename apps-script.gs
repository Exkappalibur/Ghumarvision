// ─── EUROVISION SEMI 2 POOL — Google Apps Script ───────────────────────────
// Paste this entire file into Apps Script (Extensions → Apps Script) bound
// to your Google Sheet, then deploy as a Web App. See SETUP.md for full steps.

const COUNTRIES = [
  "Albania","Armenia","Australia","Azerbaijan","Bulgaria","Cyprus","Czechia",
  "Denmark","Latvia","Luxembourg","Malta","Norway","Romania","Switzerland","Ukraine"
];

const HEADERS = [
  "Submitted At","Name","Pledged 1000 AMD","Predicted Semi Winner",
  ...COUNTRIES.map(c => "Q: " + c),
  "Favorite","Most Hated","Most WTF","Qualifier List"
];

// Form submissions arrive as application/x-www-form-urlencoded with a `payload` field.
// Form POSTs survive the Apps Script redirect cleanly, unlike fetch POST bodies.
function doPost(e) {
  try {
    const payload = e && e.parameter && e.parameter.payload;
    if (!payload) return json({ ok: false, error: "missing payload" });

    const data = JSON.parse(payload);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const qualifiers = Array.isArray(data.qualifiers) ? data.qualifiers : [];
    sheet.appendRow([
      new Date(data.timestamp || Date.now()),
      data.name || "",
      data.pledge ? "Yes" : "No",
      data.semiWinner || "",
      ...COUNTRIES.map(c => qualifiers.includes(c) ? 1 : ""),
      data.favorite || "",
      data.hated || "",
      data.wtf || "",
      qualifiers.join(", ")
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Health check — visit the deployment URL in a browser to confirm it's live.
function doGet() {
  return json({ ok: true, message: "Eurovision pool endpoint is live." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
