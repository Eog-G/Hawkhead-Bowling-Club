/* script.js */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Fetch Top Bar & Footer Contact Info (Centralized) ---
  const phoneElement = document.getElementById('clubPhone');
  const emailElement = document.getElementById('clubEmail');
  const footerElement = document.getElementById('contact'); // Get the footer element

  // Use a single fetch for all contact-related data
  if (phoneElement && emailElement && footerElement) {
    fetch('/data/contacts.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        // --- Top Bar ---
        const clubPhone = data.clubContacts.find(contact => contact.name === "Hawkhead Bowling Club Phone Number");
        const clubEmail = data.clubContacts.find(contact => contact.name === "Club Email");

        if (clubPhone) phoneElement.textContent = clubPhone.value;
        if (clubEmail) emailElement.textContent = clubEmail.value;

        // --- Footer Population ---
        populateFooter(data, footerElement);
      })
      .catch(error => {
        console.error("Failed to load contact info:", error);
        if (phoneElement) phoneElement.textContent = 'Error';
        if (emailElement) emailElement.textContent = 'Error';
        if (footerElement) footerElement.innerHTML = '<p style="text-align:center;">Error loading footer content.</p>';
      });
  }
  
  function populateFooter(data, element) {
    const address = data.clubContacts.find(c => c.name === "Club Address")?.value.replace(/\n/g, '<br>');
    const phone = data.clubContacts.find(c => c.name === "Hawkhead Bowling Club Phone Number")?.value;
    const email = data.clubContacts.find(c => c.name === "Club Email")?.value;
    const facebook = data.clubContacts.find(c => c.name === "Facebook Page")?.value;

    const footerHTML = `
      <div class="footer-shape-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
        </svg>
      </div>
      <div class="container footer-grid">
        <div>
            <h3 class="footer-heading">Contact Us</h3>
            <div class="footer-contact-info">
                ${address ? `
                <div class="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <div>
                        <p>Hawkhead Bowling Club</p>
                        <p>${address}</p>
                    </div>
                </div>` : ''}
                ${phone ? `
                <div class="footer-contact-item">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <p>${phone}</p>
                </div>` : ''}
                ${email ? `
                <div class="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                    <p>${email}</p>
                </div>` : ''}
            </div>
        </div>
        <div>
            <h3 class="footer-heading">Quick Links</h3>
            <div class="quick-links">
                <a href="/Pages/Membership/index.html" class="footer-link">Become a Member</a>
                <a href="/Pages/Social/index.html#social-events-timeline" class="footer-link">Social Events</a>
                <a href="/Pages/Photos/index.html" class="footer-link">Photo Gallery</a>
            </div>
        </div>
        <div>
            <h3 class="footer-heading">Follow Us</h3>
            <div class="social-links">
                ${facebook ? `
                <a href="${facebook}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook Page">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>` : ''}
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Hawkhead Bowling Club. All rights reserved.</p>
    </div>
    `;
    element.innerHTML = footerHTML;
  }


  // --- 2. Dynamic Active Navigation Link Highlighting ---
  const setActiveNavLink = () => {
    const currentPagePath = window.location.pathname;
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav .nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      link.classList.remove('active');
      if (currentPagePath === linkPath) {
        link.classList.add('active');
      }
    });

    if (currentPagePath === '/index.html' || currentPagePath === '/') {
        document.querySelectorAll('a[href="#home"], a[href="/"], a[href="/index.html"]').forEach(link => link.classList.add('active'));
    }
  };

  setActiveNavLink();


  // --- 3. Homepage-Specific Logic ---
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

// --- ADDED: Logic to handle anchor link scrolling after page load ---
window.addEventListener('load', () => {
  if (window.location.hash) {
    const id = window.location.hash.substring(1); // Get the ID from the hash, without the '#'
    const element = document.getElementById(id);
    if (element) {
      // Use a small timeout to ensure all dynamic content is settled
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
});