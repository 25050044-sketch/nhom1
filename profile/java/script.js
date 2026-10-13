let isSnowActive = true;
let canvas, ctx, animationFrameId;
let flakes = [];

window.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    initSnowCanvas();
    
    window.addEventListener('scroll', () => {
        const btn = document.getElementById('scrollTopBtn');
        if (window.scrollY > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
});

/* 1. HIỆU ỨNG TUYẾT RƠI CANVAS */
function initSnowCanvas() {
    canvas = document.getElementById('snowCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();

    flakes = [];
    const flakeCount = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < flakeCount; i++) {
        flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 0.8,
            d: Math.random() * flakeCount,
            opacity: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 1.2 + 0.4
        });
    }

    window.addEventListener('resize', resizeCanvas);
    drawSnow();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawSnow() {
    if (!isSnowActive || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(224, 242, 254, 0.8)";
    ctx.beginPath();

    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();

    updateSnow();
    animationFrameId = requestAnimationFrame(drawSnow);
}

function updateSnow() {
    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speed;
        f.x += Math.sin(f.d) * 0.5;

        if (f.y > canvas.height) {
            flakes[i] = {
                x: Math.random() * canvas.width,
                y: -10,
                r: f.r,
                d: f.d,
                opacity: f.opacity,
                speed: f.speed
            };
        }
    }
}

function toggleSnowEffect() {
    isSnowActive = !isSnowActive;
    const icon = document.getElementById('snowIcon');
    if (isSnowActive) {
        if (icon) icon.classList.add('animate-spin');
        drawSnow();
    } else {
        if (icon) icon.classList.remove('animate-spin');
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/* 2. MENU MOBILE TOGGLE */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

/* 3. SCROLL TO TOP */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* 4. BỘ LỌC DỰ ÁN */
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const btns = document.querySelectorAll('.project-filter-btn');

    btns.forEach(btn => {
        btn.classList.remove('bg-ice-500', 'text-night-900', 'font-bold');
        btn.classList.add('bg-white/5', 'text-ice-200');
    });
    if (event && event.target) {
        event.target.classList.add('bg-ice-500', 'text-night-900', 'font-bold');
    }

    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/* 5. MODAL CHI TIẾT DỰ ÁN */
function openModal(title, desc) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = desc;
    document.getElementById('projectModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('projectModal').classList.add('hidden');
}

/* 6. FORM VALIDATION */
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const status = document.getElementById('formStatus');

    status.classList.remove('hidden', 'bg-red-500/20', 'text-red-300', 'bg-emerald-500/20', 'text-emerald-300');

    if (!name || !email || !message) {
        status.classList.add('bg-red-500/20', 'text-red-300');
        status.textContent = "❌ Vui lòng điền đầy đủ các thông tin bắt buộc!";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        status.classList.add('bg-red-500/20', 'text-red-300');
        status.textContent = "❌ Email không đúng định dạng!";
        return;
    }

    status.classList.add('bg-emerald-500/20', 'text-emerald-300');
    status.textContent = "✅ Cảm ơn " + name + "! Lời nhắn của bạn đã được gửi thành công.";
    document.getElementById('contactForm').reset();

    setTimeout(() => {
        status.classList.add('hidden');
    }, 5000);
}
// --- XỬ LÝ ĐỔI GIAO DIỆN SÁNG / TỐI ---
function toggleTheme() {
    const htmlEl = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');

    if (isDark) {
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-amber-300';
        if (themeText) themeText.textContent = 'Tối';
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-500';
        if (themeText) themeText.textContent = 'Sáng';
        localStorage.setItem('theme', 'light');
    }
}

// Khôi phục chế độ người dùng chọn khi tải lại trang
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const htmlEl = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    if (savedTheme === 'light') {
        htmlEl.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-amber-500';
        if (themeText) themeText.textContent = 'Sáng';
    } else {
        htmlEl.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-amber-300';
        if (themeText) themeText.textContent = 'Tối';
    }
});