(() => {
  "use strict";
  const KEY = "lcrProjectInquiry";
  const content = document.getElementById("review-content");
  const empty = document.getElementById("empty-state");
  const status = document.getElementById("status");
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  let inquiry = null;
  try { inquiry = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (_) {}
  if (!inquiry) {
    if (content) content.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }
  const list = v => Array.isArray(v) ? v.map(String).filter(Boolean) :
    (v == null || String(v).trim() === "" ? [] : [String(v).trim()]);
  const setText = (field, value) => {
    const el = document.querySelector(`[data-field="${field}"]`);
    if (!el) return;
    const vals = list(value);
    el.textContent = vals.length ? vals.join(", ") : "Not provided";
  };
  setText("name", inquiry.name);
  setText("email", inquiry.email);
  setText("company", inquiry.company);
  setText("country", inquiry.country || "Not specified in this form");
  setText("service", inquiry.service);
  setText("deadline", inquiry.timeline || inquiry.deadline);
  setText("quantity", inquiry.quantity);
  setText("format", inquiry.format);
  setText("property", inquiry.propertyType);
  setText("location", inquiry.location);
  setText("budget", inquiry.budget);
  setText("details", inquiry.details || inquiry.message);

  const tags = document.querySelector('[data-field="materials"]');
  if (tags) {
    tags.replaceChildren();
    const materials = list(inquiry.materials || inquiry.availableMaterials);
    if (!materials.length) {
      const span = document.createElement("span");
      span.className = "muted";
      span.textContent = "Not specified";
      tags.appendChild(span);
    } else materials.forEach(value => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = value;
      tags.appendChild(span);
    });
  }

  const editButton = document.getElementById("edit-button");
  if (editButton) editButton.addEventListener("click", () => {
    try { sessionStorage.setItem("lcrProjectInquiryReturnToEdit", "true"); } catch (_) {}
  });

  const confirmButton = document.getElementById("confirm-button");
  if (confirmButton) confirmButton.addEventListener("click", () => {
    // Prepare an email with the reviewed answers. The client must press Send in their email app.
    const lines = [
      "NEW PROJECT INQUIRY — LC RESODEX", "",
      "ABOUT THE CLIENT", `Name: ${inquiry.name || "Not provided"}`,
      `Email: ${inquiry.email || "Not provided"}`, `Company: ${inquiry.company || "Not provided"}`, "",
      "PROJECT DETAILS", `Service: ${inquiry.service || "Not specified"}`,
      `Number of videos: ${inquiry.quantity || "Not specified"}`, `Video format: ${inquiry.format || "Not specified"}`, "",
      "PROPERTY DETAILS", `Property type: ${inquiry.propertyType || "Not specified"}`,
      `Location: ${inquiry.location || "Not provided"}`, `Available materials: ${inquiry.materials || "Not specified"}`, "",
      "BUDGET & TIMELINE", `Budget: ${inquiry.budget || "Not specified"}`, `Timeline: ${inquiry.timeline || "Not specified"}`, "",
      "PROJECT DESCRIPTION", inquiry.message || inquiry.details || "Not provided", "",
      "Sent through the LC Resodex website."
    ];
    const subject = `Project Inquiry — ${inquiry.name || "New Client"}`;
    const mailto = `mailto:hello@lcresodex.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    if (status) {
      status.hidden = false;
      status.className = "status success";
      status.textContent = "Your email application should open with your reviewed inquiry prepared. Press Send in that email application to actually send it to LC Resodex. This website cannot confirm receipt until the email is sent.";
    }
    window.location.href = mailto;
  });
})();
