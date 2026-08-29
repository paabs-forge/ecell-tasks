# E-Cell UIET KUK — Task 1

## Startup Pitch Competition Registration System

This project was created as part of the **E-Cell UIET KUK club entrance task**.

The task is a registration system for a fictional **Startup Pitch Competition**, consisting of a frontend registration page connected to a Google Apps Script backend for storing submitted responses.

> **Note:** This is a club entrance task / practice implementation and is **not an official E-Cell UIET KUK website or registration portal**.

---

## Features

- Startup Pitch Competition registration form
- Form validation
- Responsive design
- Registration data submission through Google Apps Script
- Registration responses stored in Google Sheets
- Success/error feedback after form submission

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Google Apps Script
- Google Sheets

---

## Project Structure

```text
task-1/
│
├── .vscode/
│   └── settings.json
│
├── index.html
├── style.css
├── script.js
├── apps-script.gs
└── README.md
```

---

## Running Locally

### Option 1 — Open Directly

Open `index.html` in a web browser.

### Option 2 — VS Code Live Server

1. Open the `task-1` folder in VS Code.
2. Open `index.html`.
3. Start Live Server.
4. Open the generated local URL in your browser.

---

## How the Registration System Works

1. Open the Task 1 registration page.
2. Fill in the required participant details.
3. Submit the registration form.
4. The frontend sends the submitted data to the Google Apps Script backend.
5. The Apps Script processes the submission.
6. The submitted information is stored in the connected Google Sheet.
7. The registration page displays the appropriate submission status.

---

## Viewing Registration Responses

Registration responses are stored in the connected Google Sheet.

**Spreadsheet:**

[View Registration Responses](https://docs.google.com/spreadsheets/d/1MsB83UQQ_SQWci1_omqvS0wYErcmV38U3VLtSDC7eVA/edit?usp=sharing)

### How to use the spreadsheet

1. Open the spreadsheet using the link above.
2. The submitted registration data can be viewed in the spreadsheet.
3. Each successful form submission is recorded as a new entry.
4. The spreadsheet can be used to review the participant information collected through the registration form.

### Spreadsheet Access

The spreadsheet should be accessible to the evaluator through the shared link.

If required, set the spreadsheet's sharing permission to:

**Anyone with the link → Viewer**

This allows the evaluator to view the collected registration responses without being able to modify the data.

---

## Important Files

### `index.html`

Contains the structure and content of the registration page.

### `style.css`

Contains the styling and responsive layout of the registration page.

### `script.js`

Handles frontend form interactions, validation, and communication with the backend.

### `apps-script.gs`

Contains the Google Apps Script backend responsible for receiving registration data and storing it in Google Sheets.

---

## Task 2 Integration

The registration system created in Task 1 is also used by **Task 2**.

The Task 2 website contains a **Register** CTA for the Startup Pitch Competition which redirects users to the deployed Task 1 registration page.

---

## Project Status

Completed as part of the **E-Cell UIET KUK club entrance task**.