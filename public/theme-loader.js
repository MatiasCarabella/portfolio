// Immediately load theme to prevent flash
(function () {
    try {
        const currentTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = currentTheme || (prefersDark ? 'dark' : 'light');
        const bgColor = theme === 'dark' ? '#050505' : '#ffffff';
        
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.backgroundColor = bgColor;
    } catch (e) {
        // Fallback if localStorage is not available
        document.documentElement.style.backgroundColor = '#ffffff';
    }
})();
