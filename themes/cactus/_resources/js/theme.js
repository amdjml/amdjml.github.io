(function() {
  const STORAGE_KEY = 'colortheme';

  // Available themes: white (default), light, dark, classic
  const THEMES = {
    white: { label: 'Light', cssVar: '#ffffff' },
    light: { label: 'Light', cssVar: '#e2e0de' },
    dark: { label: 'Dark', cssVar: '#1d1f21' },
    classic: { label: 'Classic', cssVar: '#f5f6f3' }
  };

  // Theme toggle button icon
  const THEME_ICON = document.createElement('span');
  THEME_ICON.className = 'theme-toggle-icon';

  // Setup theme selector dropdown
  function setupThemeSelector() {
    const headerNav = document.querySelector('#header nav ul');

    if (!headerNav) return;

    // Create theme button (after last menu item)
    const themeBtn = document.createElement('li');
    themeBtn.className = 'theme-btn';
    themeBtn.setAttribute('data-theme-toggle', 'true');

    const icon = document.createElement('span');
    icon.className = 'theme-icon';
    icon.innerHTML = '&#9783;'; // Gear icon

    themeBtn.appendChild(icon);
    headerNav.insertBefore(themeBtn, headerNav.firstChild.nextSibling); // Insert after first

    // Create dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'theme-dropdown';
    dropdownContainer.setAttribute('data-theme-dropdown', 'true');

    const ul = document.createElement('ul');

    Object.keys(THEMES).forEach(theme => {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.textContent = THEMES[theme].label;
      a.dataset.theme = theme;
      a.style.cssText = 'display:block;padding:4px 12px;color:#363533;text-decoration:none;border-radius:4px;font-size:0.8rem;';
      a.addEventListener('click', function(e) {
        e.preventDefault();
        switchTheme(theme);
        toggleDropdown(); // Hide dropdown after selection
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    dropdownContainer.appendChild(ul);
    document.body.insertBefore(dropdownContainer, headerNav);

    // Toggle dropdown visibility on click
    themeBtn.addEventListener('click', toggleDropdown);

    function toggleDropdown() {
      const wasVisible = dropdownContainer.style.display === 'block';
      dropdownContainer.style.display = wasVisible ? 'none' : 'block';
    }

    return themeBtn;
  }

  // Get initial theme based on user preference order
  function getInitialTheme() {
    let savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme && THEMES[savedTheme]) {
      return savedTheme;
    }

    // No saved preference - detect system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return prefersDark ? 'dark' : 'white';
  }

  // Apply theme and persist to localStorage
  function switchTheme(theme) {
    if (!THEMES[theme]) return;

    localStorage.setItem(STORAGE_KEY, theme);

    // Update body dataset attribute (CSS can read this!)
    document.body.dataset.theme = theme;

    // Store in dataset so CSS selectors work
    document.body.classList.remove('dark', 'light');

    if (theme !== 'white') {
      document.body.classList.add(theme);
    }

    // Optional: update meta for mobile browsers
    const link = document.querySelector('meta[name="theme-color"]');
    if (link) {
      const colors = { white: '#ffffff', light: '#e2e0de', dark: '#1d1f21', classic: '#f5f6f3' };
      link.content = colors[theme] || '#ffffff';
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const initialTheme = getInitialTheme();
      switchTheme(initialTheme);

      // Re-setup dropdown since body.dataset.theme is now set
      setupThemeSelector();
    });
  } else {
    // Already loaded
    switchTheme(getInitialTheme());

    // Re-setup after a moment for DOM to be ready
    setTimeout(setupThemeSelector, 0);
  }
})();