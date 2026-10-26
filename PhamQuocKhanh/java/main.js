var mobileBtn = document.getElementById("mobile-btn");
var menu = document.getElementById("menu");

mobileBtn.addEventListener("click", function() {
    menu.classList.toggle("show");
});

var links = menu.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function() {
        menu.classList.remove("show");
    });
}

var darkModeBtn = document.getElementById("dark-mode-btn");
darkModeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");

    var icon = darkModeBtn.querySelector("i");
    if (document.body.classList.contains("dark-theme")) {
        icon.className = "fas fa-sun"; 
    } else {
        icon.className = "fas fa-moon"; 
    }
});

var scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
});

scrollTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

var btnSubmit = document.getElementById("btnSubmit");

btnSubmit.addEventListener("click", function() {
    var name = document.getElementById("txtName").value;
    var email = document.getElementById("txtEmail").value;
    var message = document.getElementById("txtMessage").value;
    var errorMsg = document.getElementById("error-msg");

    errorMsg.innerHTML = "";

    if (name === "") {
        errorMsg.innerHTML = "Vui lòng nhập họ và tên của bạn!";
        return; 
    }

    if (email === "" || email.indexOf("@") === -1) {
        errorMsg.innerHTML = "Vui lòng nhập đúng định dạng email (phải có ký tự @)!";
        return;
    }

    if (message === "") {
        errorMsg.innerHTML = "Vui lòng nhập nội dung tin nhắn!";
        return;
    }

    alert("Cảm ơn " + name + "! Tin nhắn của bạn đã được gửi thành công.");

    document.getElementById("contactForm").reset();
});