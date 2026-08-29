const startups = [
  {
    name: "AsterPay",
    category: "FinTech",
    description:
      "A simple financial workflow for small teams to manage invoices, collections, and cash visibility in one place.",
    logo: "aster"
  },
  {
    name: "LumaLearn",
    category: "EdTech",
    description:
      "A project-based learning platform that helps students turn curiosity into guided, practical experiments.",
    logo: "luma"
  },
  {
    name: "Verdant Loop",
    category: "Sustainability",
    description:
      "A circular marketplace helping local businesses find practical ways to reuse materials and reduce operational waste.",
    logo: "verdant"
  },
  {
    name: "Nexora Health",
    category: "HealthTech",
    description:
      "A care-navigation concept that helps people organize health information and find the right next step.",
    logo: "nexora"
  },
  {
    name: "OrbitDesk",
    category: "SaaS",
    description:
      "A lightweight workspace for small teams to turn scattered tasks, decisions, and notes into a clear operating rhythm.",
    logo: "orbit"
  },
  {
    name: "MiraAI",
    category: "AI",
    description:
      "An AI-assisted research companion designed to help early-stage teams structure questions, sources, and insights.",
    logo: "mira"
  },
  {
    name: "Cartwise",
    category: "E-commerce",
    description:
      "A shopping discovery concept that helps customers compare everyday products around fit, value, and intent.",
    logo: "cartwise"
  },
  {
    name: "Folk & Form",
    category: "Consumer",
    description:
      "A curated consumer brand concept connecting independent makers with people looking for thoughtfully made products.",
    logo: "folk"
  }
];

const startupGrid = document.querySelector("#startup-grid");
const searchInput = document.querySelector("#startup-search");
const clearSearch = document.querySelector(".clear-search");
const filterGroup = document.querySelector("#category-filters");
const resultsCount = document.querySelector("#results-count");
const clearFiltersButton = document.querySelector("#clear-filters");
const emptyClearButton = document.querySelector("#empty-clear");
const emptyState = document.querySelector("#empty-state");

const form = document.querySelector("#startup-form");
const formSuccess = document.querySelector("#form-success");
const descriptionInput = document.querySelector("#description");
const charCount = document.querySelector("#char-count");

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

let activeCategory = "All";


/* =========================================
   STARTUP LOGOS
========================================= */

const logoMarks = {
  aster: `
    <svg viewBox="0 0 40 40" role="img" aria-label="AsterPay logo">
      <path
        d="M20 4l4.5 11.5L36 20l-11.5 4.5L20 36l-4.5-11.5L4 20l11.5-4.5L20 4z"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <circle cx="20" cy="20" r="3.5" fill="currentColor"/>
    </svg>
  `,

  luma: `
    <svg viewBox="0 0 40 40" role="img" aria-label="LumaLearn logo">
      <circle
        cx="20"
        cy="20"
        r="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M13 25c4-7 8-7 14-12"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <circle cx="13" cy="25" r="2.5" fill="currentColor"/>
    </svg>
  `,

  verdant: `
    <svg viewBox="0 0 40 40" role="img" aria-label="Verdant Loop logo">
      <path
        d="M20 34C9 29 7 17 15 9c5 5 10 11 5 25z"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M20 34c1-8 5-14 13-19"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  `,

  nexora: `
    <svg viewBox="0 0 40 40" role="img" aria-label="Nexora Health logo">
      <path
        d="M20 34s-12-7-12-17a7 7 0 0112-5 7 7 0 0112 5c0 10-12 17-12 17z"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M14 20h12M20 14v12"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  `,

  orbit: `
    <svg viewBox="0 0 40 40" role="img" aria-label="OrbitDesk logo">
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="7"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="7"
        ry="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor"/>
    </svg>
  `,

  mira: `
    <svg viewBox="0 0 40 40" role="img" aria-label="MiraAI logo">
      <path
        d="M7 27l8-14 5 8 5-12 8 18"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="15" cy="13" r="2" fill="currentColor"/>
    </svg>
  `,

  cartwise: `
    <svg viewBox="0 0 40 40" role="img" aria-label="Cartwise logo">
      <path
        d="M8 11h4l3 17h14l3-12H13"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="18" cy="33" r="2" fill="currentColor"/>
      <circle cx="28" cy="33" r="2" fill="currentColor"/>
    </svg>
  `,

  folk: `
    <svg viewBox="0 0 40 40" role="img" aria-label="Folk & Form logo">
      <path
        d="M10 30V10h18M10 20h13M10 30h17"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <circle cx="29" cy="11" r="3" fill="currentColor"/>
    </svg>
  `
};


/* =========================================
   CATEGORY FILTERS
========================================= */

function getCategories() {
  return [
    "All",
    ...new Set(startups.map((startup) => startup.category))
  ];
}

function renderFilters() {
  filterGroup.innerHTML = getCategories()
    .map(
      (category) => `
        <button
          class="filter-button ${category === activeCategory ? "active" : ""}"
          type="button"
          data-category="${category}"
          aria-pressed="${category === activeCategory}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  filterGroup
    .querySelectorAll(".filter-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        renderFilters();
        renderStartups();
      });
    });
}


/* =========================================
   FILTER STARTUPS
========================================= */

function getFilteredStartups() {
  const query = searchInput.value.trim().toLowerCase();

  return startups.filter((startup) => {
    const matchesCategory =
      activeCategory === "All" ||
      startup.category === activeCategory;

    const searchableText = `
      ${startup.name}
      ${startup.category}
      ${startup.description}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });
}


/* =========================================
   RENDER STARTUP CARDS
========================================= */

function renderStartups() {
  const filtered = getFilteredStartups();

  startupGrid.innerHTML = filtered
    .map(
      (startup, index) => `
        <article
          class="startup-card"
          style="animation-delay: ${Math.min(index * 45, 220)}ms"
        >
          <div class="card-top">
            <div
              class="logo-box"
              aria-label="${startup.name} logo"
            >
              ${logoMarks[startup.logo]}
            </div>

            <span class="category-badge">
              ${startup.category}
            </span>
          </div>

          <h3>${startup.name}</h3>

          <p>${startup.description}</p>

          <a
            class="card-link"
            href="https://example.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit site
            <span aria-hidden="true">↗</span>
          </a>
        </article>
      `
    )
    .join("");

  const countLabel =
    filtered.length === 1
      ? "1 startup shown"
      : `${filtered.length} startups shown`;

  resultsCount.textContent = countLabel;

  emptyState.hidden = filtered.length !== 0;
  startupGrid.hidden = filtered.length === 0;

  clearSearch.hidden = searchInput.value.length === 0;
}


/* =========================================
   CLEAR SEARCH + FILTERS
========================================= */

function clearFilters() {
  activeCategory = "All";
  searchInput.value = "";

  renderFilters();
  renderStartups();

  searchInput.focus();
}

searchInput.addEventListener("input", () => {
  renderStartups();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";

  renderStartups();

  searchInput.focus();
});

clearFiltersButton.addEventListener("click", clearFilters);

emptyClearButton.addEventListener("click", clearFilters);


/* =========================================
   DESCRIPTION CHARACTER COUNT
========================================= */

descriptionInput.addEventListener("input", () => {
  if (descriptionInput.value.length > 300) {
    descriptionInput.value =
      descriptionInput.value.slice(0, 300);
  }

  charCount.textContent =
    `${descriptionInput.value.length} / 300`;
});


/* =========================================
   FORM VALIDATION
========================================= */

function setError(id, message) {
  const field = document.querySelector(`#${id}`);
  const error = document.querySelector(`#${id}-error`);

  field.closest(".field").classList.toggle(
    "invalid",
    Boolean(message)
  );

  error.textContent = message;
}

function validateForm() {
  const founderName =
    document.querySelector("#founder-name").value.trim();

  const startupName =
    document.querySelector("#startup-name").value.trim();

  const email =
    document.querySelector("#email").value.trim();

  const domain =
    document.querySelector("#domain").value;

  const description =
    descriptionInput.value.trim();

  const website =
    document.querySelector("#website").value.trim();

  let valid = true;

  setError("founder-name", "");
  setError("startup-name", "");
  setError("email", "");
  setError("domain", "");
  setError("description", "");
  setError("website", "");


  if (!founderName) {
    setError(
      "founder-name",
      "Please enter a founder or team name."
    );

    valid = false;
  }


  if (!startupName) {
    setError(
      "startup-name",
      "Please enter a startup name."
    );

    valid = false;
  }


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setError(
      "email",
      "Please enter an email address."
    );

    valid = false;
  } else if (!emailPattern.test(email)) {
    setError(
      "email",
      "Please enter a valid email address."
    );

    valid = false;
  }


  if (!domain) {
    setError(
      "domain",
      "Please choose a startup domain."
    );

    valid = false;
  }


  if (!description) {
    setError(
      "description",
      "Please add a short description."
    );

    valid = false;
  }


  if (website) {
    try {
      const parsed = new URL(website);

      if (
        !["http:", "https:"].includes(
          parsed.protocol
        )
      ) {
        throw new Error();
      }
    } catch {
      setError(
        "website",
        "Enter a valid URL starting with http:// or https://."
      );

      valid = false;
    }
  }

  return valid;
}


/* =========================================
   FORM SUBMISSION
========================================= */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  formSuccess.hidden = true;

  if (!validateForm()) {
    const firstInvalid = form.querySelector(
      ".field.invalid input, " +
      ".field.invalid select, " +
      ".field.invalid textarea"
    );

    firstInvalid?.focus();

    return;
  }

  /*
    This is intentionally frontend-only.
    Nothing is sent to a server.
  */

  form.reset();

  charCount.textContent = "0 / 300";

  document
    .querySelectorAll(".field")
    .forEach((field) => {
      field.classList.remove("invalid");
    });

  document
    .querySelectorAll(".field-error")
    .forEach((error) => {
      error.textContent = "";
    });

  formSuccess.hidden = false;
});


/* =========================================
   MOBILE NAVIGATION
========================================= */

function closeMobileMenu() {
  mobileMenu.classList.remove("open");

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen =
    mobileMenu.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen
      ? "Close navigation menu"
      : "Open navigation menu"
  );

  document.body.classList.toggle(
    "menu-open",
    isOpen
  );
});


mobileMenu
  .querySelectorAll("a")
  .forEach((link) => {
    link.addEventListener(
      "click",
      closeMobileMenu
    );
  });


document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    mobileMenu.classList.contains("open")
  ) {
    closeMobileMenu();

    menuToggle.focus();
  }
});


/* =========================================
   INITIAL RENDER
========================================= */

renderFilters();
renderStartups();