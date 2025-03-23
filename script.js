let lastScrollY = window.scrollY;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        navbar.style.top = "-150px"; // Hide navbar
    } else {
        navbar.style.top = "0"; // Show navbar
    }
    lastScrollY = window.scrollY;
});
