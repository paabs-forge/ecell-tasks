/**
 * E-Cell Startup Pitch Competition -- registration backend
 *
 * SETUP:
 * 1. Create a new Google Sheet, add a header row exactly as:
 *    Timestamp | Registration ID | Full Name | Email | Phone | Team Name | Startup Idea
 * 2. Copy the Sheet ID out of its URL:
 *    https://docs.google.com/spreadsheets/d/  <THIS PART>  /edit
 * 3. Extensions > Apps Script, delete the boilerplate, paste this file in.
 * 4. In the Apps Script editor: Project Settings (gear icon, left sidebar)
 *    > Script Properties > Add script property.
 *      Key:   SPREADSHEET_ID
 *      Value: the Sheet ID from step 2
 *    This keeps the Sheet ID out of the code entirely, and it is never
 *    sent to or readable from the frontend -- it only exists inside this
 *    Apps Script project's server-side configuration.
 * 5. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL into CONFIG.SCRIPT_URL in script.js.
 *
 * Nothing in this file -- no Sheet ID, no key, no credential -- is ever
 * placed in the frontend. The deployment URL pasted into script.js is
 * a public endpoint, not a secret; access control here comes from what
 * this script is allowed to do under your account, not from hiding the URL.
 */

const REQUIRED_FIELDS = ["fullName", "email", "phone", "teamName", "idea", "submittedAt"];
// Sheet's header row should read exactly:
// Timestamp | Registration ID | Full Name | Email | Phone | Team Name | Startup Idea

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(false, "No request body received.");
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse(false, "Request body was not valid JSON.");
    }

    const validationError = validateRegistration(data);
    if (validationError) {
      return jsonResponse(false, validationError);
    }

    const sheet = getTargetSheet();
    if (!sheet) {
      return jsonResponse(false, "Server isn't configured with a target spreadsheet yet.");
    }

    const teamName = data.teamName.trim();

    if (teamNameExists(sheet, teamName)) {
      return jsonResponse(
        false,
        "Team name already registered. Please choose another team name."
      );
    }

    const registrationId = generateRegistrationId();

    sheet.appendRow([
      new Date(),
      registrationId,
      data.fullName.trim(),
      data.email.trim(),
      data.phone.trim(),
      teamName,
      data.idea.trim(),
    ]);

    return jsonResponse(true, "Registration saved.", { registrationId: registrationId });
  } catch (err) {
    // Catch-all so an unexpected server error never leaks internal details,
    // and never gets mistaken for a saved registration on the frontend.
    return jsonResponse(false, "Server error while saving the registration.");
  }
}

/**
 * Resolves the one spreadsheet this backend is allowed to write to.
 * Reads SPREADSHEET_ID from Script Properties (server-side config,
 * never sent to the browser) instead of relying on "whichever
 * spreadsheet happens to be active", which is not a well-defined
 * concept during a web app execution.
 */
function getTargetSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) return null;
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  return spreadsheet.getSheets()[0];
}


function teamNameExists(sheet, teamName) {
  const lastRow = sheet.getLastRow();

  // No registrations yet.
  if (lastRow < 2) return false;

  // Team Name is column F (6).
  const existingNames = sheet
    .getRange(2, 6, lastRow - 1, 1)
    .getDisplayValues();

  const normalizedName = teamName
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

  return existingNames.some((row) => {
    const existingName = String(row[0])
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();

    return existingName === normalizedName;
  });
}

/**
 * Server-generated, collision-resistant registration ID.
 * Uses an atomic counter guarded by a script lock so two near-simultaneous
 * submissions can never be handed the same number -- appropriate for a
 * small event's expected concurrency without needing a database.
 */
function generateRegistrationId() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    let seq = parseInt(props.getProperty("LAST_SEQ") || "0", 10);
    seq += 1;
    props.setProperty("LAST_SEQ", String(seq));
    return "SPC26-" + String(seq).padStart(4, "0");
  } finally {
    lock.releaseLock();
  }
}

/**
 * Server-side validation, independent of whatever the frontend already
 * checked -- a request that skips the browser entirely still has to pass
 * these rules before anything is written to the sheet.
 */
function validateRegistration(data) {
  const missing = REQUIRED_FIELDS.filter(
    (field) => !data[field] || String(data[field]).trim() === ""
  );
  if (missing.length > 0) {
    return `Missing required field(s): ${missing.join(", ")}`;
  }

  const email = String(data.email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email address is not a valid format.";
  }

  const phoneDigits = String(data.phone).replace(/\D/g, "");
  const last10 = phoneDigits.slice(-10);
  if (!/^[6-9]\d{9}$/.test(last10)) {
    return "Phone number is not a valid 10-digit Indian mobile number.";
  }

  if (String(data.teamName).trim().length < 2) {
    return "Team name is too short.";
  }

  const ideaLength = String(data.idea).trim().length;
  if (ideaLength < 30 || ideaLength > 500) {
    return "Startup idea must be between 30 and 500 characters.";
  }

  return null; // no error
}

function jsonResponse(ok, message, extra) {
  const body = Object.assign(
    { status: ok ? "ok" : "error", message: message },
    extra || {}
  );
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lets you sanity-check the deployment URL in a browser (GET request).
function doGet() {
  return ContentService
    .createTextOutput("E-Cell registration endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
