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

            // If the newly active slide has a video, rewind and play it
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
            }, 5000); // Change image every 5 seconds
        };

        const resetAutoPlay = () => {
            clearInterval(slideInterval);
            startAutoPlay();
        };

        if(prevBtn && nextBtn) {
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

        // Initial setup
        showSlide(slideIndex);
        startAutoPlay();
    }

});
