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

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Write the header row the first time
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const qualifiers = Array.isArray(data.qualifiers) ? data.qualifiers : [];

    const row = [
      new Date(data.timestamp || Date.now()),
      data.name || "",
      data.pledge ? "Yes" : "No",
      data.semiWinner || "",
      ...COUNTRIES.map(c => qualifiers.includes(c) ? 1 : ""),
      data.favorite || "",
      data.hated || "",
      data.wtf || "",
      qualifiers.join(", ")
    ];

    sheet.appendRow(row);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Handles both health-check GETs and form submissions sent as ?payload=<json>
function doGet(e) {
  if (e && e.parameter && e.parameter.payload) {
    try {
      const data = JSON.parse(e.parameter.payload);
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getActiveSheet();

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
        sheet.setFrozenRows(1);
      }

      const qualifiers = Array.isArray(data.qualifiers) ? data.qualifiers : [];
      const row = [
        new Date(data.timestamp || Date.now()),
        data.name || "",
        data.pledge ? "Yes" : "No",
        data.semiWinner || "",
        ...COUNTRIES.map(c => qualifiers.includes(c) ? 1 : ""),
        data.favorite || "",
        data.hated || "",
        data.wtf || "",
        qualifiers.join(", ")
      ];
      sheet.appendRow(row);
      return json({ ok: true });
    } catch (err) {
      return json({ ok: false, error: String(err) });
    }
  }
  return json({ ok: true, message: "Eurovision pool endpoint is live." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
