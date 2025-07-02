document.addEventListener('DOMContentLoaded', () => {

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
                // Find the main phone and email from the contacts data
                const clubPhone = data.clubContacts.find(contact => contact.name === "Hawkhead BC Phone Number");
                const clubEmail = data.clubContacts.find(contact => contact.name === "Club Email");

                if (clubPhone) {
                    phoneElement.textContent = clubPhone.value;
                }
                if (clubEmail) {
                    emailElement.textContent = clubEmail.value;
                }
            })
            .catch(error => {
                console.error("Failed to load top bar contact info:", error);
                phoneElement.textContent = 'Error loading';
                emailElement.textContent = 'Error loading';
            });
    }

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