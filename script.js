document.addEventListener('DOMContentLoaded', () => {

const yearsOfHistoryElement = document.getElementById('years-of-history');
    if (yearsOfHistoryElement) {
        const currentYear = new Date().getFullYear();
        const yearsOfHistory = currentYear - 1912;
        yearsOfHistoryElement.textContent = yearsOfHistory;
    }

  // --- Mobile Menu (Hamburger) Logic ---
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

  // --- Scroll-triggered animation for INDIVIDUAL feature cards ---
  const featureCards = document.querySelectorAll('#facilities .home-card');

  // This check ensures the code only runs if feature cards exist on the page
  if (featureCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When a card enters the viewport, add the 'is-visible' class
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Stop observing the card once it's visible
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1 // Animation triggers when 10% of the card is visible
    });

    // Tell the observer to watch each feature card
    featureCards.forEach(card => {
      observer.observe(card);
    });
  }

});