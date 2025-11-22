// Load icons data
let iconEntries = [];
let filteredIcons = [];

// Fetch and initialize
fetch('./icons-data.json')
  .then(response => response.json())
  .then(data => {
    iconEntries = data;
    filteredIcons = [...iconEntries];
    renderIcons(filteredIcons);
  })
  .catch(err => {
    console.error('Failed to load icons data:', err);
    const grid = document.getElementById('icons-grid');
    if (grid) {
      grid.innerHTML = '<div class="no-results">Failed to load icons. Please run: npm run dev:icons</div>';
    }
  });

// Render icons
function renderIcons(icons) {
  const grid = document.getElementById('icons-grid');
  const iconCount = document.querySelector('.icon-count');

  if (!grid || !iconCount) return;

  iconCount.textContent = `${icons.length} of ${iconEntries.length} icons`;

  if (icons.length === 0) {
    grid.innerHTML = '<div class="no-results">No icons found matching your search</div>';
    return;
  }

  grid.innerHTML = '';

  icons.forEach(({ name, typeName, svg }) => {
    const card = document.createElement('div');
    card.className = 'icon-card';
    card.setAttribute('data-icon-type', typeName);

    // Create icon wrapper with SVG
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';
    iconWrapper.innerHTML = svg;

    // Create name element
    const nameEl = document.createElement('div');
    nameEl.className = 'icon-name';
    nameEl.textContent = name;

    // Create type element
    const typeEl = document.createElement('div');
    typeEl.className = 'icon-type';
    typeEl.textContent = `'${typeName}'`;

    // Add click handler to copy type
    card.addEventListener('click', () => {
      copyToClipboard(typeName);
    });

    card.appendChild(iconWrapper);
    card.appendChild(nameEl);
    card.appendChild(typeEl);

    grid.appendChild(card);
  });
}

// Copy to clipboard with toast notification
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast();
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  });
}

// Show toast notification
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Search functionality
function handleSearch(query) {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    filteredIcons = [...iconEntries];
  } else {
    filteredIcons = iconEntries.filter(({ name, typeName }) => {
      return name.toLowerCase().includes(searchTerm) ||
             typeName.toLowerCase().includes(searchTerm);
    });
  }

  renderIcons(filteredIcons);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }
});
