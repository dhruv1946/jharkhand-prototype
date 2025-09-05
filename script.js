document.addEventListener('DOMContentLoaded', () => {

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }


    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    if (themeToggle && htmlElement) {
        const applyTheme = (theme) => {
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                htmlElement.classList.add('dark');
                themeToggle.checked = true;
            } else {
                htmlElement.classList.remove('dark');
                themeToggle.checked = false;
            }
        };

        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }


    const animatedElements = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(element => {
        observer.observe(element);
    });


    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (slides.length > 0) {
        let slideIndex = 0;
        let slideInterval;

        const showSlide = (n) => {
            slideIndex = n;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            if (slideIndex < 0) {
                slideIndex = slides.length - 1;
            }

            slides.forEach(slide => {
                slide.classList.remove('active-slide');
                const video = slide.querySelector('video');
                if (video) {
                    video.pause();
                }
            });

            dots.forEach(dot => dot.classList.remove('active-dot'));
            const activeSlide = slides[slideIndex];
            activeSlide.classList.add('active-slide');
            dots[slideIndex].classList.add('active-dot');
            const activeVideo = activeSlide.querySelector('video');
            if (activeVideo) {
                activeVideo.currentTime = 0;
                activeVideo.play();
            }
        };

        const changeSlide = (n) => {
            showSlide(slideIndex += n);
        };

        const currentSlide = (n) => {
            showSlide(n);
        };

        const startAutoPlay = () => {
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, 5000);
        };

        const resetAutoPlay = () => {
            clearInterval(slideInterval);
            startAutoPlay();
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                changeSlide(-1);
                resetAutoPlay();
            });

            nextBtn.addEventListener('click', () => {
                changeSlide(1);
                resetAutoPlay();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide(index);
                resetAutoPlay();
            });
        });
        showSlide(slideIndex);
        startAutoPlay();
    }
    const cursor = document.getElementById("cursor");
    const amount = 20;
    const sineDots = Math.floor(amount * 0.3);
    const width = 26;
    const idleTimeout = 150;
    let lastFrame = 0;
    let mousePosition = { x: 0, y: 0 };
    let dotElements = [];
    let timeoutID;
    let idle = false;

    class Dot {
        constructor(index = 0) {
            this.index = index;
            this.anglespeed = 0.05;
            this.x = 0;
            this.y = 0;
            this.scale = 1 - 0.05 * index;
            this.range = width / 2 - width / 2 * this.scale + 2;
            this.limit = width * 0.75 * this.scale;
            this.element = document.createElement("span");
            this.element.style.transform = `scale(${this.scale})`;
            cursor.appendChild(this.element);
        }

        lock() {
            this.lockX = this.x;
            this.lockY = this.y;
            this.angleX = Math.PI * 2 * Math.random();
            this.angleY = Math.PI * 2 * Math.random();
        }

        draw() {
            if (!idle || this.index <= sineDots) {
                this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
            } else {
                this.angleX += this.anglespeed;
                this.angleY += this.anglespeed;
                this.y = this.lockY + Math.sin(this.angleY) * this.range;
                this.x = this.lockX + Math.sin(this.angleX) * this.range;
                this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
            }
        }
    }

    function init() {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
        lastFrame = new Date().getTime();
        buildDots();
        render();
    }

    function startIdleTimer() {
        timeoutID = setTimeout(goInactive, idleTimeout);
        idle = false;
    }

    function resetIdleTimer() {
        clearTimeout(timeoutID);
        startIdleTimer();
    }

    function goInactive() {
        idle = true;
        for (let dot of dotElements) {
            dot.lock();
        }
    }

    function buildDots() {
        for (let i = 0; i < amount; i++) {
            let dot = new Dot(i);
            dotElements.push(dot);
        }
    }

    const onMouseMove = event => {
        mousePosition.x = event.clientX - width / 2;
        mousePosition.y = event.clientY - width / 2;
        resetIdleTimer();
    };

    const onTouchMove = (event) => {
        mousePosition.x = event.touches[0].clientX - width / 2;
        mousePosition.y = event.touches[0].clientY - width / 2;
        resetIdleTimer();
    };

    const render = () => {
        positionCursor();
        requestAnimationFrame(render);
    };

    const positionCursor = () => {
        let x = mousePosition.x;
        let y = mousePosition.y;
        dotElements.forEach((dot, index, dots) => {
            let nextDot = dots[index + 1] || dots[0];
            dot.x = x;
            dot.y = y;
            dot.draw();
            if (!idle || index <= sineDots) {
                const dx = (nextDot.x - dot.x) * 0.35;
                const dy = (nextDot.y - dot.y) * 0.35;
                x += dx;
                y += dy;
            }
        });
    };

    init();
});
