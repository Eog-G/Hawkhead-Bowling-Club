document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Fetch Top Bar Contact Info (Centralized) ---
  const phoneElement = document.getElementById('clubPhone');
  const emailElement = document.getElementById('clubEmail');

  if (phoneElement && emailElement) {
    // Use a root-relative path to ensure it works from any page
    fetch('/data/contacts.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const clubPhone = data.clubContacts.find(contact => contact.name === "Hawkhead BC Phone Number");
        const clubEmail = data.clubContacts.find(contact => contact.name === "Club Email");

        if (clubPhone) phoneElement.textContent = clubPhone.value;
        if (clubEmail) emailElement.textContent = clubEmail.value;
      })
      .catch(error => {
        console.error("Failed to load top bar contact info:", error);
        phoneElement.textContent = 'Error loading';
        emailElement.textContent = 'Error loading';
      });
  }

  // --- 2. Dynamic Active Navigation Link Highlighting ---
  const setActiveNavLink = () => {
    const currentPagePath = window.location.pathname;
    // Find all nav links in both desktop and mobile menus
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav .nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      // Remove any existing 'active' class
      link.classList.remove('active');

      // Add 'active' class if the link's path matches the current page's path
      if (currentPagePath === linkPath) {
        link.classList.add('active');
      }
    });

    // Special case for the homepage (index.html)
    if (currentPagePath === '/index.html' || currentPagePath === '/') {
        // The homepage link in the menu often just points to '#' or the root
        document.querySelectorAll('a[href="#home"], a[href="/"], a[href="/index.html"]').forEach(link => link.classList.add('active'));
    }
  };

  setActiveNavLink(); // Call the function on page load


  // --- 3. Existing Homepage Logic (No changes needed here) ---
  const yearsOfHistoryElement = document.getElementById('years-of-history');
  if (yearsOfHistoryElement) {
    const currentYear = new Date().getFullYear();
    const yearsOfHistory = currentYear - 1912;
    yearsOfHistoryElement.textContent = yearsOfHistory;
  }

  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuButton && mobileMenu && menuIcon && closeIcon) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
  }

  const featureCards = document.querySelectorAll('#facilities .home-card');
  if (featureCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    featureCards.forEach(card => {
      observer.observe(card);
    });
  }
});