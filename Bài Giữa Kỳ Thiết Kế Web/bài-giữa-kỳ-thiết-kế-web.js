document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("weatherCanvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  let weatherMode = "sunny"; // Mặc định: 'sunny' hoặc 'rainy'

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // 1. Hạt bụi nắng
  const sunParticles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 3 + 1,
    alpha: Math.random() * 0.6 + 0.2,
    speedY: Math.random() * 0.5 + 0.2,
    speedX: Math.random() * 0.3 - 0.15,
  }));

  let rayAngle = 0;

  // 2. Mây bồng bềnh
  const clouds = Array.from({ length: 5 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight * 0.35),
    radius: Math.random() * 80 + 60,
    speed: Math.random() * 0.2 + 0.1,
  }));

  // 3. Hạt mưa
  const rainDrops = Array.from({ length: 250 }, () => ({
    x: Math.random() * (window.innerWidth + 200) - 100,
    y: Math.random() * window.innerHeight,
    length: Math.random() * 22 + 12,
    speedY: Math.random() * 14 + 10,
    speedX: -2.5,
    opacity: Math.random() * 0.6 + 0.3,
  }));

  // 4. Sóng gợn nước mưa
  let splashes = [];
  function createSplash(x) {
    splashes.push({
      x: x,
      y: height - Math.random() * 20,
      radius: 1,
      maxRadius: Math.random() * 12 + 5,
      opacity: 0.8,
    });
  }

  // --- VẼ HIỆU ỨNG TRỜI NẮNG ---
  function drawSunny() {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#fceabb");
    bgGrad.addColorStop(1, "#f8b500");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const sunX = width * 0.8;
    const sunY = height * 0.2;

    // Mặt trời tỏa sáng
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 300);
    sunGlow.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    sunGlow.addColorStop(0.3, "rgba(255, 223, 100, 0.5)");
    sunGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 300, 0, Math.PI * 2);
    ctx.fill();

    // Dải tia nắng xoay
    rayAngle += 0.002;
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate(rayAngle);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        Math.max(width, height),
        (i * Math.PI) / 6,
        ((i + 0.4) * Math.PI) / 6,
      );
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Mây trôi
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x - c.radius > width) c.x = -c.radius * 2;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.arc(
        c.x + c.radius * 0.6,
        c.y - c.radius * 0.2,
        c.radius * 0.7,
        0,
        Math.PI * 2,
      );
      ctx.arc(
        c.x - c.radius * 0.6,
        c.y - c.radius * 0.2,
        c.radius * 0.7,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    // Hạt bụi nắng lấp lánh
    sunParticles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- VẼ HIỆU ỨNG TRỜI MƯA ---
  function drawRainy() {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(0.6, "#1e293b");
    bgGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(180, 220, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    rainDrops.forEach((drop) => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + drop.speedX, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speedY;
      drop.x += drop.speedX;

      if (drop.y >= height - 10) {
        if (Math.random() > 0.6) createSplash(drop.x);
        drop.y = -drop.length;
        drop.x = Math.random() * (width + 200);
      }
    });

    splashes.forEach((s, idx) => {
      ctx.strokeStyle = `rgba(200, 230, 255, ${s.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      s.radius += 0.5;
      s.opacity -= 0.03;

      if (s.opacity <= 0 || s.radius >= s.maxRadius) {
        splashes.splice(idx, 1);
      }
    });

    if (Math.random() < 0.005) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(0, 0, width, height);
    }
  }

  // VÒNG LẶP ANIMATION
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    if (weatherMode === "sunny") {
      drawSunny();
    } else {
      drawRainy();
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // NÚT CHUYỂN NẮNG / MƯA
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const icon = document.getElementById("themeIcon");
      if (weatherMode === "sunny") {
        weatherMode = "rainy";
        document.body.setAttribute("data-theme", "rainy");
        if (icon) icon.className = "fa-solid fa-cloud-showers-heavy";
      } else {
        weatherMode = "sunny";
        document.body.setAttribute("data-theme", "sunny");
        if (icon) icon.className = "fa-solid fa-sun";
      }
    });
  }

  // MENU MOBILE
  const hamburger = document.getElementById("hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      document.getElementById("navLinks").classList.toggle("active");
    });
  }

  // FILTER DỰ ÁN
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".project-card").forEach((card) => {
        card.style.display =
          filter === "all" || card.getAttribute("data-category") === filter
            ? "block"
            : "none";
      });
    });
  });

  // FORM SUBMIT
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("toast");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }
      e.target.reset();
    });
  }

  // SCROLL TO TOP
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("show", window.scrollY > 300);
    });
    scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
});
