// ==========================================
// 1. TUYẾT RƠI TƯƠNG TÁC THEO CHUỘT (MOUSE REPULSION)
// ==========================================
const canvas = document.getElementById('snowCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const flakes = Array.from({ length: 70 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: Math.random() * 1 + 0.5,
        r: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.3,
        baseX: 0
    }));

    let isSnowing = true;

    function drawFlakes() {
        if (!isSnowing) {
            ctx.clearRect(0, 0, width, height);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.classList.contains('dark');

        flakes.forEach(flake => {
            // Tính khoảng cách đến con trỏ chuột
            let dx = mouse.x - flake.x;
            let dy = mouse.y - flake.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Tương tác dạt ra khi chuột đến gần
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                flake.x -= Math.cos(angle) * force * 5;
                flake.y -= Math.sin(angle) * force * 5;
            } else {
                flake.x += Math.sin(flake.y / 30) * 0.5;
            }

            flake.y += flake.vy;

            // Tái tạo lại vị trí khi rơi qua màn hình
            if (flake.y > height) {
                flake.y = -10;
                flake.x = Math.random() * width;
            }
            if (flake.x < 0) flake.x = width;
            if (flake.x > width) flake.x = 0;

            // Vẽ hạt tuyết
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
            ctx.fillStyle = isDark 
                ? `rgba(224, 242, 254, ${flake.opacity})` 
                : `rgba(14, 165, 233, ${flake.opacity * 0.85})`;
            ctx.fill();
        });

        requestAnimationFrame(drawFlakes);
    }

    drawFlakes();

    window.toggleSnowEffect = function() {
        isSnowing = !isSnowing;
        if (isSnowing) drawFlakes();
    };
}

// ==========================================
// 2. HIỆU ỨNG nghiêng 3D KHI DI CHUỘT VÀO THẺ (3D TILT EFFECT)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card, .glass-panel-hover');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // Độ nghiêng X
            const rotateY = ((x - centerX) / centerX) * 8;  // Độ nghiêng Y

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});

// ==========================================
// 3. HIỆU ỨNG CUỘN TRANG HIỆN HÌNH MƯỢT MÀ (SCROLL REVEAL)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('section, article');
    
    revealElements.forEach(el => el.classList.add('reveal-item'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
});

// ==========================================
// 4. CHUYỂN ĐỔI GIAO DIỆN SÁNG / TỐI (THEME TOGGLE)
// ==========================================
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

// ==========================================
// 5. CÁC TÍNH NĂNG TIỆN ÍCH KHÁC (MENU, POPUP, FORM)
// ==========================================
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

function openModal(title, description) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    
    if (modal && modalTitle && modalDesc) {
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.add('hidden');
}

function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.project-filter-btn');

    buttons.forEach(btn => btn.classList.remove('active', 'bg-ice-500', 'text-white'));

    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const status = document.getElementById('formStatus');
    if (status) {
        status.textContent = 'Gửi tin nhắn thành công! Nam sẽ phản hồi sớm nhất.';
        status.className = 'p-3 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30';
        status.classList.remove('hidden');
        document.getElementById('contactForm').reset();
    }
}

window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        if (window.scrollY > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}