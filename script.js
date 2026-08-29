// ============================================================
// CONFIG
// ------------------------------------------------------------
// After you deploy the Google Apps Script web app (see
// apps-script.gs + README instructions), paste its deployment
// URL below. This URL is not a secret -- it's a public endpoint
// that runs under your own Google account's permissions. Do NOT
// put a Sheet ID, API key, or any credential here or anywhere
// in this file.
// ============================================================
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzv20SqOP_npXZ_49gaXcl1XfQjygdjOQ3DTuLFUWUva8Fp1BAGiRQLIT-zkfjjV89OIw/exec",
};

// ============================================================
// VALIDATION RULES
// ============================================================
const validators = {
  fullName: (v) => {
    v = v.trim();
    if (!v) return "Enter your full name.";
    if (v.length < 2) return "Name looks too short.";
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return "Use letters only (no numbers or symbols).";
    return "";
  },
  email: (v) => {
    v = v.trim();
    if (!v) return "Enter an email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "That email doesn't look valid.";
    return "";
  },
  phone: (v) => {
    v = v.trim();
    if (!v) return "Enter a phone number.";
    if (!/^[6-9]\d{9}$/.test(v)) return "Enter a valid 10-digit Indian mobile number.";
    return "";
  },
  teamName: (v) => {
    v = v.trim();
    if (!v) return "Enter a team name.";
    if (v.length < 2) return "Team name looks too short.";
    return "";
  },
  idea: (v) => {
    v = v.trim();
    if (!v) return "Describe your startup idea.";
    if (v.length < 30) return `Add a bit more detail (${v.length}/30 characters minimum).`;
    if (v.length > 500) return "Keep it under 500 characters.";
    return "";
  },
};

const form = document.getElementById("reg-form");
const submitBtn = document.getElementById("submit-btn");
const successCard = document.getElementById("success-card");
const submitError = document.getElementById("submit-error");
const ideaField = document.getElementById("idea");
const ideaCount = document.getElementById("idea-count");


// live character count for the idea textarea
ideaField.addEventListener("input", () => {
  ideaCount.textContent = `${ideaField.value.trim().length} / 500`;
});

// validate a single field and render/clear its error message
function validateField(name) {
  const input = document.getElementById(name);
  const errorEl = document.getElementById(`err-${name}`);
  const message = validators[name](input.value);
  errorEl.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

// validate on blur, and re-validate on input once a field has already been checked once
Object.keys(validators).forEach((name) => {
  const input = document.getElementById(name);
  input.addEventListener("blur", () => validateField(name));
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid")) validateField(name);
  });
});

// phone: only allow digits, trim to 10 as the user types
document.getElementById("phone").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});

function validateAll() {
  const results = Object.keys(validators).map(validateField);
  return results.every(Boolean);
}

function focusFirstInvalid() {
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
}

function setSubmitError(message) {
  submitError.textContent = message;
  submitError.hidden = !message;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// SUBMIT TO GOOGLE SHEETS (via Apps Script web app)
// ------------------------------------------------------------
// This is a cross-origin request: the page is hosted separately
// from script.google.com, so the browser's CORS rules apply to
// reading the response, not just sending the request.
//
// The request itself is kept as a CORS "simple request" (POST,
// Content-Type: text/plain -- one of the CORS-safelisted content
// types) specifically so the browser sends it directly, without a
// preflight OPTIONS request first. Apps Script web apps don't
// implement OPTIONS handling, so a preflighted request (e.g.
// Content-Type: application/json) would be blocked before it ever
// reaches doPost -- that's a real failure mode we avoid here, not
// a hypothetical one.
//
// A simple request still requires the server's response to include
// an Access-Control-Allow-Origin header for the browser to let this
// script read the response body. Apps Script web apps deployed with
// "Execute as: Me" / "Who has access: Anyone" send that header on
// their JSON output, so response.json() below is readable in
// practice. We don't just assume that, though: every failure mode
// (network error, blocked read, non-ok status, malformed JSON, or
// the backend's own status:"error") is caught below and all of them
// lead to the same place -- an explicit retry message, never a
// success claim that wasn't actually confirmed by the backend.
// ============================================================
async function sendToSheet(payload) {
  const response = await fetch(CONFIG.SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend responded with status ${response.status}`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Backend response wasn't valid JSON.");
  }

  if (result.status !== "ok" || !result.registrationId) {
    throw new Error(result.message || "Backend reported the save failed.");
  }

  return result; // { status: "ok", registrationId, message }
}

function showRealSuccess(registrationId, teamName) {
  document.getElementById("success-code").textContent = registrationId;
  document.getElementById("success-heading").textContent = "You're registered.";
  document.getElementById("success-msg").innerHTML =
    `Your entry for <strong>${escapeHtml(teamName)}</strong> was saved to the event sheet. ` +
    `Keep the code above -- you'll need it at check-in.`;
  form.hidden = true;
  successCard.hidden = false;
  successCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateAll()) {
    focusFirstInvalid();
    return;
  }

  setSubmitError("");

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: "+91 " + document.getElementById("phone").value.trim(),
    teamName: document.getElementById("teamName").value.trim(),
    idea: document.getElementById("idea").value.trim(),
    submittedAt: new Date().toISOString(),
  };

  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-label").textContent = "Submitting…";

  try {
    const result = await sendToSheet(payload);
    showRealSuccess(result.registrationId, payload.teamName);
  } catch (err) {
    console.error(err);
    setSubmitError(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-label").textContent = "Submit entry";
  }
});


document.getElementById("reset-btn").addEventListener("click", () => {
  form.reset();
  ideaCount.textContent = "0 / 500";
  setSubmitError("");
  Object.keys(validators).forEach((name) => {
    document.getElementById(name).removeAttribute("aria-invalid");
    document.getElementById(`err-${name}`).textContent = "";
  });
  successCard.hidden = true;
  form.hidden = false;
  document.getElementById("fullName").focus();
});
