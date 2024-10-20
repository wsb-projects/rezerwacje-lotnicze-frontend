document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navButtons.classList.toggle('active');
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // Cookie consent
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');

    acceptCookies.addEventListener('click', () => {
        cookieConsent.classList.add('hidden');
        // Set a cookie or localStorage item to remember the user's choice
    });

    rejectCookies.addEventListener('click', () => {
        cookieConsent.classList.add('hidden');
        // Handle cookie rejection (e.g., disable non-essential cookies)
    });
    AOS.init({
        duration: 1000,
        once: true,
        offset: 200
    });
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing JavaScript ...
    
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 200
        });
    
        // Initialize Swiper
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    
        // Initialize Flatpickr
        flatpickr("#depart-date", {
            dateFormat: "Y-m-d",
            minDate: "today",
        });
    
        flatpickr("#return-date", {
            dateFormat: "Y-m-d",
            minDate: "today",
        });
    
        // Initialize Micromodal
        MicroModal.init();
    
        // Initialize Tippy.js
        tippy('[data-tippy-content]', {
            animation: 'scale',
        });
    
        // Example of opening a modal
        document.querySelector('.open-modal-btn').addEventListener('click', function() {
            MicroModal.show('modal-1');
        });
    });
});