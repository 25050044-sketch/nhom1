document.addEventListener('DOMContentLoaded', function () {
    const filterBtns = document.querySelectorAll('.filter-buttons button');
    const projectItem = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const currentBtns = e.currentTarget;

            filterBtns.forEach(b => b.classList.remove('active'));
            currentBtns.classList.add('active');

            const filterbtn= currentBtns.getAttribute('data-filter');
            projectItem.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterbtn === 'all' || itemCategory === filterbtn) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 100);
                }
            });
        });
    });

    const contactForm = document.getElementById('contactForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccessAlert = document.getElementById('formSuccessAlert');

   if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let isValid  = true;

            if (fullNameInput && fullNameInput.value.trim().length < 3) {
                fullNameInput.classList.add('is-invalid');
                fullNameInput.classList.remove('is-valid');
            } else if (fullNameInput) {
                fullNameInput.classList.remove('is-invalid');
                fullNameInput.classList.add('is-valid');
            }

            const emailPatter = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPatter.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                emailInput.classList.remove('is-valid');
            } else if (emailInput) {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }

            if (messageInput && messageInput.value.trim() === '') {
                messageInput.classList.add('is-invalid');
                messageInput.classList.remove('is-valid');
                isValid = false;
            } else if (messageInput) {
                messageInput.classList.remove('is-invalid');
                messageInput.classList.add('is-valid');
            }

            if (isValid) {
                if (formSuccessAlert) {
                    formSuccessAlert.classList.remove('d-none');
                    contactForm.reset();
                }
                if (fullNameInput) {
                    fullNameInput.classList.remove('is-valid');
                }
                if (emailInput) {
                    emailInput.classList.remove('is-valid');
                }
                if  (messageInput) {
                    messageInput.classList.remove('is-valid');
                }

                setTimeout(function () {
                    if (formSuccessAlert) {
                        formSuccessAlert.classList.add('d-none');
                    }
                }, 4000);
            }
        });
   }

   const btnThemetoggle = document.getElementById('themeToggle');
   if (btnThemetoggle) {
    btnThemetoggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');

        const icon = btnThemetoggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fa-solid fa-sun';
            btnThemetoggle.classList.replace('btn-outline-light', 'btn-outline-warning');
        } else {
            icon.className = 'fa-solid fa-moon';
            btnThemetoggle.classList.replace('btn-outline-warning', 'btn-outline-light');
        }
    }); 
   }
   const ScrollTopBtn = document.getElementById("scrollTopBtn");
   window.onscroll = function () {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            ScrollTopBtn.style.display = "block";
        } else {
            ScrollTopBtn.style.display = "none";
        }
   };
   ScrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
   });
});
  

  