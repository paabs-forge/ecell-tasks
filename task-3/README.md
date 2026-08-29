# E-Cell UIET KUK — Task 3

A responsive startup showcase / pitch-event style webpage created as a club entrance task for E-Cell UIET KUK.

The experience is designed around an event journey: discover showcased startups, search and filter them by domain, explore their demo links, and submit your own startup idea through a frontend-only demo form.

## Features

- Responsive desktop, tablet, and mobile design
- Participating startup cards generated dynamically with JavaScript
- Real-time, case-insensitive startup search
- Search across startup name, category, and description
- Category/domain filtering
- Search and category filtering working together
- Empty search-result state with a working clear-filters action
- External startup/demo links opening safely in a new tab
- Subtle hover and entrance animations
- Continuous animated hero showcase elements
- Mobile hamburger navigation with accessible ARIA state
- Frontend-only startup submission form
- Client-side validation for required fields, email, description, and optional URL
- Demo confirmation after successful form submission
- Official Site link to the existing Task 2 E-Cell website
- Reduced-motion support through `prefers-reduced-motion`

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

No frameworks, backend, database, API, authentication, or build system is required.

## Project Structure

task-3/
├── index.html
├── styles.css
├── script.js
└── README.md

No local image assets are required. Startup visual identities are rendered as simple inline SVG marks from `script.js`.

## How to Run

### Option 1 — Open Directly

Open `index.html` in a modern web browser.

### Option 2 — VS Code Live Server

1. Open the `task-3` folder in VS Code.
2. Open `index.html`.
3. Start Live Server.
4. Open the generated local URL.

## Live Demo

Task 3 is deployed using GitHub Pages:

https://paabs-forge.github.io/ecell-tasks/task-3/

## Important Note

- The displayed startups are fictional sample/demo entries created for this project.
- They must not be interpreted as confirmed E-Cell UIET KUK participants.
- The startup links point to `example.com` as safe demo destinations rather than pretending fictional startups have real websites.
- The submission form is frontend-only.
- Form data is not sent to a server and is not stored anywhere.
- The successful submission message explicitly identifies the interaction as a demo.
- This is not an official E-Cell UIET KUK event website.

## Official Site

Official Site:

https://paabs-forge.github.io/ecell-tasks/task-2/

This link points to the existing Task 2 E-Cell website and opens in a new browser tab.

## Submission

GitHub Repository:

https://github.com/paabs-forge/ecell-tasks

Task 3 is located in the `task-3/` directory of the repository.