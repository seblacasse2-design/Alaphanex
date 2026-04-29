// script.js

// Smooth Scrolling
const scrollLinks = document.querySelectorAll('a[href^="#"]');

scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Form Validation
const form = document.querySelector('#contactForm');

form.addEventListener('submit', function(e) {
    let valid = true;
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');

    if (!nameInput.value) {
        valid = false;
        alert('Name is required.');
    }
    if (!emailInput.value) {
        valid = false;
        alert('Email is required.');
    }

    if (!valid) e.preventDefault();
});

// Animations
const animatedElements = document.querySelectorAll('.animated');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, options);

animatedElements.forEach(element => {
    observer.observe(element);
});

// Interactive Effects
const robots = document.querySelectorAll('.robot-item');

robots.forEach(robot => {
    robot.addEventListener('mouseenter', function() {
        this.classList.add('highlight');
    });
    robot.addEventListener('mouseleave', function() {
        this.classList.remove('highlight');
    });
});
