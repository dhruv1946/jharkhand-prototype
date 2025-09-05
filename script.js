document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // --- Mobile Menu Toggle ---
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Theme Toggle Logic ---
    if (themeToggle && htmlElement) {
        // Function to apply the chosen theme
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

        // Listener for toggle switch change
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        // Initialize theme on page load
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light'); // Default to light
        }
    }
});