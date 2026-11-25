/* =========================================================
   LC RESODEX — SITE JAVASCRIPT
   Safe to load on pages that do not contain every component.
   ========================================================= */

/* PAGE LOADER */
const loader = document.querySelector(".page-loader");
let pageIsRevealed = false;
function revealPage() {
  if (pageIsRevealed) return;
  pageIsRevealed = true;
  if (loader) loader.classList.add("hidden");
  setTimeout(() => document.body.classList.add("loaded"), 250);
}
window.addEventListener("load", () => setTimeout(revealPage, 1200));
setTimeout(revealPage, 4200);

/* ROTATING TYPING TEXT */
const typingElement = document.getElementById("typing-text");
const phrases = [
  "LC Resodex creates premium real estate video content.",
  "We turn properties into visual stories built to attract attention.",
  "Built for agents, agencies and property brands.",
  "Short form. Long form. Custom real estate content.",
  "Your property deserves visuals worth watching."
];
let phraseIndex = 0, characterIndex = 0, isDeleting = false;
const typingSpeed = 45, deletingSpeed = 25, holdTime = 3000;
function typeLoop() {
  if (!typingElement) return;
  const currentPhrase = phrases[phraseIndex];
  if (!isDeleting) {
    typingElement.textContent = currentPhrase.substring(0, characterIndex + 1);
    characterIndex++;
    if (characterIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, holdTime);
      return;
    }
    setTimeout(typeLoop, typingSpeed);
    return;
  }
  typingElement.textContent = currentPhrase.substring(0, characterIndex - 1);
  characterIndex--;
  if (characterIndex <= 0) {
    characterIndex = 0;
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 500);
    return;
  }
  setTimeout(typeLoop, deletingSpeed);
}
setTimeout(typeLoop, 900);

/* MOBILE MENU */
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });
}
mobileLinks.forEach(link => link.addEventListener("click", () => {
  if (mobileMenu) mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}));

/* ACTIVE NAVIGATION */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
function updateActiveNav() {
  const scrollPosition = window.scrollY + 150;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    }
  });
}
window.addEventListener("scroll", updateActiveNav);

/* SCROLL REVEAL */
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

/* SMOOTH ANCHOR SCROLLING — safe on pages without the homepage navbar */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(event) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  });
});

/* HERO BACKGROUND PARALLAX */
const heroBackground = document.querySelector(".hero-background");
window.addEventListener("scroll", () => {
  if (!heroBackground) return;
  const scroll = window.scrollY;
  if (scroll < window.innerHeight) heroBackground.style.transform = `scale(1.02) translateY(${scroll * 0.08}px)`;
});

/* PORTFOLIO HOVER MOVEMENT */
document.querySelectorAll(".portfolio-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const centerX = rect.width / 2, centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -1.5;
    const rotateY = ((x - centerX) / centerX) * 1.5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });
});

/* BUTTON ARROW MICRO INTERACTION */
document.querySelectorAll(".btn, .nav-cta").forEach(button => {
  button.addEventListener("mouseenter", () => { button.style.transition = "transform 0.3s ease"; });
});

/* NAVBAR BACKGROUND ON SCROLL — safe on non-homepage pages */
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.style.background = "rgba(8,8,8,0.72)";
    navbar.style.backdropFilter = "blur(16px)";
  } else {
    navbar.style.background = "linear-gradient(to bottom, rgba(8,8,8,0.88), rgba(8,8,8,0))";
    navbar.style.backdropFilter = "none";
  }
});

/* START A PROJECT — VALIDATE, SAVE, THEN OPEN THE REVIEW PAGE */
(() => {
  const form = document.querySelector("#project-inquiry-form");
  if (!form) return;
  const status = document.querySelector("#project-form-status");
  const storageKey = "lcrProjectInquiry";
  const returnKey = "lcrProjectInquiryReturnToEdit";

  const fields = {
    name: document.getElementById("client-name"),
    email: document.getElementById("client-email"),
    company: document.getElementById("client-company"),
    service: document.getElementById("project-service"),
    quantity: document.getElementById("project-quantity"),
    format: document.getElementById("project-format"),
    propertyType: document.getElementById("property-type"),
    location: document.getElementById("property-location"),
    materials: document.getElementById("project-materials"),
    budget: document.getElementById("project-budget"),
    timeline: document.getElementById("project-timeline"),
    message: document.getElementById("project-message")
  };
  const showStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("form-error", isError);
    status.setAttribute("role", isError ? "alert" : "status");
  };
  const value = field => field ? field.value.trim() : "";

  // Restore values when the client chooses “Edit details” on the review page.
  try {
    if (sessionStorage.getItem(returnKey) === "true") {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (saved) {
        if (fields.name) fields.name.value = saved.name || "";
        if (fields.email) fields.email.value = saved.email || "";
        if (fields.company) fields.company.value = saved.company || "";
        if (fields.service) fields.service.value = saved.service || "";
        if (fields.quantity) fields.quantity.value = saved.quantity || "";
        if (fields.format) fields.format.value = saved.format || "";
        if (fields.propertyType) fields.propertyType.value = saved.propertyType || "";
        if (fields.location) fields.location.value = saved.location || "";
        if (fields.materials) fields.materials.value = saved.materials || "";
        if (fields.budget) fields.budget.value = saved.budget || "";
        if (fields.timeline) fields.timeline.value = saved.timeline || "";
        if (fields.message) fields.message.value = saved.message || "";
      }
      sessionStorage.removeItem(returnKey);
    }
  } catch (error) {
    console.warn("Could not restore the saved inquiry in this browser session.", error);
  }

  // Clear the validation message as the user corrects the form.
  form.querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("input", () => {
      if (status) {
        status.textContent = "";
        status.classList.remove("form-error");
      }
    });
    field.addEventListener("change", () => {
      if (status) {
        status.textContent = "";
        status.classList.remove("form-error");
      }
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const requiredChecks = [
      { field: fields.name, message: "Please enter your full name before continuing." },
      { field: fields.email, message: "Please enter your email address before continuing." },
      { field: fields.service, message: "Please choose a service before continuing." },
      { field: fields.message, message: "Please describe your project before continuing." }
    ];
    for (const check of requiredChecks) {
      if (!check.field || !value(check.field)) {
        showStatus(check.message, true);
        if (check.field) {
          check.field.focus();
          check.field.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }
    if (!fields.email.checkValidity()) {
      showStatus("Please enter a valid email address, for example name@example.com.", true);
      fields.email.focus();
      fields.email.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const inquiry = {
      name: value(fields.name),
      email: value(fields.email),
      company: value(fields.company),
      country: "",
      service: value(fields.service),
      quantity: value(fields.quantity),
      format: value(fields.format),
      propertyType: value(fields.propertyType),
      location: value(fields.location),
      materials: value(fields.materials),
      budget: value(fields.budget),
      timeline: value(fields.timeline),
      deadline: value(fields.timeline),
      message: value(fields.message),
      details: value(fields.message)
    };
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(inquiry));
    } catch (error) {
      showStatus("Your browser could not save this inquiry for review. Please enable session storage or try another browser.", true);
      return;
    }
    window.location.href = "project-review.html";
  });
})();
