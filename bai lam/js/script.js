document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".nav-panel");
const menuLinks = document.querySelectorAll(".nav-links a, .nav-contact");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Mở menu");
  menuPanel.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Mở menu" : "Đóng menu");
  menuPanel.classList.toggle("is-open", !isExpanded);
});
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

const themeButton = document.querySelector(".theme-toggle");
const themeSymbol = document.querySelector(".theme-symbol");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") document.body.classList.add("theme-dark");

function updateThemeControl() {
  const isDark = document.body.classList.contains("theme-dark");
  themeButton.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
  themeSymbol.textContent = isDark ? "☼" : "◐";
}
updateThemeControl();
themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("theme-dark");
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  updateThemeControl();
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const emptyFilterMessage = document.querySelector(".filter-empty");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.hidden = !shouldShow;
      visibleCount += Number(shouldShow);
    });
    emptyFilterMessage.hidden = visibleCount > 0;
  });
});

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const fields = {
  name: document.querySelector("#contact-name"),
  email: document.querySelector("#contact-email"),
  message: document.querySelector("#contact-message"),
};
const errors = {
  name: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  message: document.querySelector("#message-error"),
};
function setFieldError(fieldName, message) {
  errors[fieldName].textContent = message;
  fields[fieldName].setAttribute("aria-invalid", String(Boolean(message)));
}
Object.entries(fields).forEach(([fieldName, field]) => {
  field.addEventListener("input", () => {
    setFieldError(fieldName, "");
    formStatus.textContent = "";
  });
});
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim());
  const validation = {
    name: fields.name.value.trim() ? "" : "Vui lòng nhập họ và tên.",
    email: !fields.email.value.trim() ? "Vui lòng nhập email." : emailIsValid ? "" : "Email chưa đúng định dạng.",
    message: fields.message.value.trim() ? "" : "Vui lòng nhập lời nhắn.",
  };
  Object.entries(validation).forEach(([fieldName, message]) => setFieldError(fieldName, message));
  const firstInvalidField = Object.keys(validation).find((fieldName) => validation[fieldName]);
  if (firstInvalidField) {
    formStatus.textContent = "Vui lòng kiểm tra lại thông tin.";
    fields[firstInvalidField].focus();
    return;
  }
  formStatus.textContent = "Thông tin hợp lệ. Biểu mẫu chưa kết nối dịch vụ gửi thư.";
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const progressIndicator = document.querySelector(".reading-progress");
const progressBar = document.querySelector(".reading-progress-bar");
const backToTopButton = document.querySelector(".back-to-top-floating");
let scrollUpdateScheduled = false;

function updateScrollControls() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
  const percentage = Math.round(progress * 100);
  progressBar.style.transform = `scaleX(${progress})`;
  progressIndicator.setAttribute("aria-valuenow", String(percentage));
  backToTopButton.hidden = window.scrollY < 500;
  scrollUpdateScheduled = false;
}

window.addEventListener("scroll", () => {
  if (!scrollUpdateScheduled) {
    window.requestAnimationFrame(updateScrollControls);
    scrollUpdateScheduled = true;
  }
}, { passive: true });
window.addEventListener("resize", updateScrollControls);
backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
updateScrollControls();

const sectionLinks = document.querySelectorAll("[data-section-link]");
const linkedSections = [...sectionLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];

    if (!activeEntry) return;

    sectionLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${activeEntry.target.id}`;
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-18% 0px -67% 0px", threshold: 0 });

  linkedSections.forEach((section) => sectionObserver.observe(section));
}
