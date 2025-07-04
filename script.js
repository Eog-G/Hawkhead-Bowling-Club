/* script.js */

document.addEventListener('DOMContentLoaded', () => {

  // --- Generic Intersection Observer for Fade-in Animations ---
  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
  }, { threshold: 0.1 });

  // --- 1. Fetch Top Bar & Footer Contact Info (Centralized) ---
  const phoneElement = document.getElementById('clubPhone');
  const emailElement = document.getElementById('clubEmail');
  const footerElement = document.getElementById('contact');

  if (phoneElement && emailElement && footerElement) {
    fetch('/data/contacts.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        const clubPhone = data.clubContacts.find(contact => contact.name === "Hawkhead Bowling Club Phone Number");
        const clubEmail = data.clubContacts.find(contact => contact.name === "Club Email");

        if (clubPhone) phoneElement.textContent = clubPhone.value;
        if (clubEmail) emailElement.textContent = clubEmail.value;

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
                ${address ? `<div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg><div><p>Hawkhead Bowling Club</p><p>${address}</p></div></div>` : ''}
                ${phone ? `<div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><p>${phone}</p></div>` : ''}
                ${email ? `<div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footer-icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg><p>${email}</p></div>` : ''}
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
                ${facebook ? `<a href="${facebook}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook Page"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>` : ''}
            </div>
        </div>
    </div>
    <div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} Hawkhead Bowling Club. All rights reserved.</p></div>`;
    element.innerHTML = footerHTML;
  }

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

  const yearsOfHistoryElement = document.getElementById('years-of-history');
  if (yearsOfHistoryElement) {
    const currentYear = new Date().getFullYear();
    yearsOfHistoryElement.textContent = currentYear - 1912;
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

  // Apply staggered animation to the "Why Choose Us" cards
  const featureCards = document.querySelectorAll('#facilities .home-card');
  featureCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 100}ms`;
      animationObserver.observe(card);
  });

  const loadUpcomingEvents = async () => {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    try {
        const [gentsRes, ladiesRes, socialRes] = await Promise.all([
            fetch('/data/gents.json'),
            fetch('/data/ladies.json'),
            fetch('/data/social.json')
        ]);
        if (!gentsRes.ok || !ladiesRes.ok || !socialRes.ok) {
            throw new Error('Failed to fetch one or more event data files.');
        }
        const gentsData = await gentsRes.json();
        const ladiesData = await ladiesRes.json();
        const socialData = await socialRes.json();

        const gentsEvents = gentsData.outdoorEvents.map(event => ({ ...event, type: 'Gents', link: '/Pages/Gents/index.html#gents-events-timeline' }));
        const ladiesEvents = ladiesData.outdoorEvents.map(event => ({ ...event, type: 'Ladies', link: '/Pages/Ladies/index.html#ladies-events-timeline' }));
        const socialEvents = socialData.socialEvents.events.map(event => ({ ...event, type: 'Social', link: '/Pages/Social/index.html#social-events-timeline' }));
        
        const allEvents = [...gentsEvents, ...ladiesEvents, ...socialEvents];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = allEvents.filter(event => new Date(event.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextThreeEvents = upcomingEvents.slice(0, 3);
        newsGrid.innerHTML = '';

        if (nextThreeEvents.length === 0) {
            newsGrid.innerHTML = `<div class="no-events-card"><div class="no-events-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div><h3 class="no-events-title">No Upcoming Events Scheduled</h3><p class="no-events-text">It's quiet for now! Please check back later for new events, competitions, and social nights.</p></div>`;
            return;
        }

        const defaultImages = {
            section: {'Gents': 'assets/images/events/defaults/gents.jpg', 'Ladies': 'assets/images/events/defaults/ladies.jpg', 'Social': 'assets/images/events/defaults/social.jpg'},
            keyword: {'trophy': {'Gents': 'assets/images/events/defaults/trophy-gents.jpg', 'Ladies': 'assets/images/events/defaults/trophy-ladies.jpg'}, 'friendly': {'Gents': 'assets/images/events/defaults/friendly-gents.jpg', 'Ladies': 'assets/images/events/defaults/friendly-ladies.jpg'}, 'triples': {'Gents': 'assets/images/events/defaults/triples-gents.jpg', 'Ladies': 'assets/images/events/defaults/triples-ladies.jpg'}, 'pairs': {'Gents': 'assets/images/events/defaults/pairs-gents.jpg', 'Ladies': 'assets/images/events/defaults/pairs-ladies.jpg'}, 'singles': {'Gents': 'assets/images/events/defaults/singles-gents.jpg', 'Ladies': 'assets/images/events/defaults/singles-ladies.jpg'}, 'fours': {'Gents': 'assets/images/events/defaults/fours-gents.jpg', 'Ladies': 'assets/images/events/defaults/fours-ladies.jpg'}, 'cheese': {'Social': 'assets/images/events/defaults/wine-and-cheese.jpg'}, 'xmas': {'Social': 'assets/images/events/defaults/xmas-social.jpg'}, 'christmas': {'Social': 'assets/images/events/defaults/xmas-social.jpg'}}
        };
        
        const getEventImageUrl = (event) => {
            if (event.image) return `assets/images/events/custom/${event.type.toLowerCase()}/${event.image}`;
            const eventNameLower = event.name.toLowerCase();
            for (const keyword in defaultImages.keyword) {
                if (eventNameLower.includes(keyword)) {
                    const keywordMapping = defaultImages.keyword[keyword];
                    if (keywordMapping[event.type]) return keywordMapping[event.type];
                    if (keywordMapping['default']) return keywordMapping['default'];
                }
            }
            return defaultImages.section[event.type];
        }

        nextThreeEvents.forEach((event, index) => {
            const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
            const imageUrl = getEventImageUrl(event);
            const description = event.description || `This is an event for the <strong>${event.type} Section</strong>.`;
            const anchor = document.createElement('a');
            anchor.href = event.link;
            anchor.className = 'news-card-anchor';
            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `<img src="${imageUrl}" alt="${event.name}" class="news-card-image"><div class="news-card-content"><div class="news-card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="news-card-icon"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg><span>${formattedDate}</span></div><h3 class="news-card-title">${event.name}</h3><p class="news-card-excerpt">${description}</p><div class="news-card-link-text">Go to ${event.type} Section <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div></div>`;
            anchor.appendChild(card);
            anchor.style.transitionDelay = `${index * 100}ms`;
            animationObserver.observe(anchor);
            newsGrid.appendChild(anchor);
        });
    } catch (error) {
        console.error('Error loading upcoming events:', error);
        if(newsGrid) newsGrid.innerHTML = '<p>Could not load upcoming events. Please try again later.</p>';
    }
  };

  const loadSponsors = async () => {
    const sponsorsGrid = document.getElementById('sponsors-grid');
    const sponsorsTitle = document.getElementById('sponsors-title');
    const sponsorsSubtitle = document.getElementById('sponsors-subtitle');
    if (!sponsorsGrid) return;
    try {
        const response = await fetch('/data/sponsors.json');
        if (!response.ok) throw new Error('Failed to fetch sponsors.json');
        const data = await response.json();
        if(sponsorsTitle) sponsorsTitle.textContent = data.sectionTitle;
        if(sponsorsSubtitle) sponsorsSubtitle.textContent = data.sectionSubtitle;
        sponsorsGrid.innerHTML = '';
        data.sponsors.forEach((sponsor, index) => {
            const logoPath = `assets/images/sponsors/${sponsor.logo}`;
            const sponsorLink = document.createElement('a');
            sponsorLink.href = sponsor.website;
            sponsorLink.title = `Visit ${sponsor.name}`;
            sponsorLink.target = '_blank';
            sponsorLink.rel = 'noopener noreferrer';
            sponsorLink.className = 'sponsor-logo-link';
            const sponsorLogo = document.createElement('img');
            sponsorLogo.src = logoPath;
            sponsorLogo.alt = `${sponsor.name} Logo`;
            sponsorLogo.className = 'sponsor-logo';
            sponsorLink.appendChild(sponsorLogo);
            sponsorLink.style.transitionDelay = `${index * 120}ms`;
            animationObserver.observe(sponsorLink);
            sponsorsGrid.appendChild(sponsorLink);
        });
    } catch (error) {
        console.error('Error loading sponsors:', error);
        if(sponsorsGrid) sponsorsGrid.innerHTML = '<p>Our sponsors could not be loaded at this time.</p>';
    }
  };

  loadUpcomingEvents();
  loadSponsors();
});