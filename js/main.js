(() => {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) setMenu(false); });

  /* ---------- Header border on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active nav link + reveal on scroll ---------- */
  const links = [...document.querySelectorAll('.nav-menu a[href^="#"]:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));

    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const counter = document.getElementById("message-count");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => {
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v)) return "Name can only contain letters, spaces and . ' -";
      return "";
    },
    email: (v) => {
      if (!v) return "Please enter your email address.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email, e.g. name@example.com.";
      return "";
    },
    subject: (v) => {
      if (!v) return "Please add a subject.";
      if (v.length < 3) return "Subject must be at least 3 characters.";
      return "";
    },
    message: (v) => {
      if (!v) return "Please write a message.";
      if (v.length < 10) return `Message must be at least 10 characters (${v.length} so far).`;
      return "";
    },
  };

  const validateField = (input) => {
    const value = input.value.trim();
    const message = rules[input.name](value);
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(message));
    field.classList.toggle("valid", !message && value.length > 0);
    document.getElementById(`${input.name}-error`).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  };

  const inputs = Object.keys(rules).map((n) => form.elements[n]);

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) validateField(input);
      if (input.name === "message") counter.textContent = `${input.value.length} / ${input.maxLength}`;
    });
  });

  const setStatus = (text, type) => {
    statusEl.textContent = text;
    statusEl.className = `form-status ${type || ""}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");

    const results = inputs.map(validateField);
    if (results.includes(false)) {
      inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus();
      setStatus("Please fix the highlighted fields.", "fail");
      return;
    }

    // Honeypot: silently pretend success for bots
    if (form.elements.website.value) { form.reset(); return; }

    const data = Object.fromEntries(inputs.map((i) => [i.name, i.value.trim()]));
    const endpoint = form.dataset.endpoint;

    // No backend configured: open the visitor's mail client with the message prefilled
    if (!endpoint) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href =
        `mailto:${form.dataset.fallbackEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      setStatus("Opening your email app to send the message…", "success");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      form.reset();
      inputs.forEach((i) => i.closest(".field").classList.remove("valid", "invalid"));
      counter.textContent = `0 / ${form.elements.message.maxLength}`;
      setStatus("Thanks! Your message was sent. I'll reply soon.", "success");
    } catch (err) {
      setStatus(`Could not send right now. Please email ${form.dataset.fallbackEmail} directly.`, "fail");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
})();
