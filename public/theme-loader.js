(function () {
    const currentTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.backgroundColor = '#050505';
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.backgroundColor = '#ffffff';
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.backgroundColor = '#050505';
    } else {
        // Default to light if no preference
        document.documentElement.style.backgroundColor = '#ffffff';
    }
})();
