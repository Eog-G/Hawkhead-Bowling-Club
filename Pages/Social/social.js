// Corrected Pages/Social/social.js

document.addEventListener('DOMContentLoaded', () => {
    const socialContentContainer = document.getElementById('social-content-container');
    const introElement = document.getElementById('page-intro');

    // --- HELPER FUNCTIONS (No changes here) ---
    function generateICS(event) {
        const eventDate = new Date(event.date);
        const year = eventDate.getFullYear();
        const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
        const day = eventDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        const uid = `${formattedDate}-${event.name.replace(/\s/g, '')}@hawkhead-bowling-club.com`;
        const now = new Date();
        const dtstamp = now.getUTCFullYear() + (now.getUTCMonth() + 1).toString().padStart(2, '0') + now.getUTCDate().toString().padStart(2, '0') + 'T' + now.getUTCHours().toString().padStart(2, '0') + now.getUTCMinutes().toString().padStart(2, '0') + now.getUTCSeconds().toString().padStart(2, '0') + 'Z';
        return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HawkheadBowlingClub//Website//EN', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtstamp}`, `DTSTART;VALUE=DATE:${formattedDate}`, `DTEND;VALUE=DATE:${formattedDate}`, `SUMMARY:${event.name}`, `DESCRIPTION:Event: ${event.name} at Hawkhead Bowling Club`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
    }

    function downloadToFile(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function animateTimeEntries(panelElement) {
        if (!panelElement) return;
        const entries = panelElement.querySelectorAll('.time-entry');
        entries.forEach(entry => entry.classList.remove('is-visible'));
        setTimeout(() => {
            entries.forEach((entry, index) => {
                entry.style.transitionDelay = `${index * 75}ms`;
                entry.classList.add('is-visible');
            });
        }, 10);
    }

    // --- ICONS (No changes here) ---
    const icons = {
        organiser: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        sun: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        snowflake: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-snow" viewBox="0 0 16 16"><path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966-.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5-.5z"/></svg>',
        facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>'
    };

    Promise.all([
        fetch('../../data/social.json').then(res => res.json()),
        fetch('../../data/contacts.json').then(res => res.json())
    ])
    .then(([socialData, contactsData]) => {
        
        // ... all the page building logic ... (this is all correct)
        if (socialData.pageIntro) {
            introElement.textContent = socialData.pageIntro;
        }

        if (socialData.keyContacts && socialData.keyContacts.length > 0) {
            const contactsSection = document.createElement('div');
            contactsSection.className = 'content-section fade-in-up';
            const title = document.createElement('h3');
            title.className = 'content-subtitle';
            title.textContent = 'Key Contacts';
            contactsSection.appendChild(title);
            const convener = socialData.keyContacts.find(c => c.role === 'Social Convener');
            if (convener) {
                const convenerContainer = document.createElement('div');
                convenerContainer.className = 'key-person-container';
                const card = document.createElement('div');
                card.className = 'key-person-card';
                card.innerHTML = `<div class="key-person-icon">${icons.organiser}</div><div class="key-person-details"><p class="key-person-title">${convener.role}</p><p class="key-person-name">${convener.name}</p></div>`;
                convenerContainer.appendChild(card);
                contactsSection.appendChild(convenerContainer);
            }
            const agents = socialData.keyContacts.filter(c => c.role === 'Ticket Agent');
            if (agents.length > 0) {
                const gridContainer = document.createElement('div');
                gridContainer.className = 'committee-grid';
                agents.forEach(agent => {
                    const card = document.createElement('div');
                    card.className = 'committee-member-card';
                    card.innerHTML = `<p class="member-role">${agent.role}</p><p class="member-name">${agent.name}</p>`;
                    gridContainer.appendChild(card);
                });
                contactsSection.appendChild(gridContainer);
            }
            socialContentContainer.appendChild(contactsSection);
        }

        const separator1 = document.createElement('hr');
        separator1.className = 'content-separator fade-in-up';
        socialContentContainer.appendChild(separator1);

        if (socialData.socialEvents && socialData.socialEvents.events.length > 0) {
            const eventsSection = document.createElement('section');
            eventsSection.className = 'events-section fade-in-up';
            eventsSection.id = 'social-events-timeline';
            const title = document.createElement('h3');
            title.className = 'content-subtitle';
            title.textContent = `Social Events ${socialData.socialEvents.year}`;
            eventsSection.appendChild(title);
            const note = document.createElement('p');
            note.className = 'timeline-note';
            note.innerHTML = '💡 Click on any upcoming event to add it to your calendar.';
            eventsSection.appendChild(note);
            const timelineContainer = document.createElement('div');
            timelineContainer.className = 'vertical-timeline';
            const sortedEvents = socialData.socialEvents.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            const now = new Date();
            let nextEventMarked = false;
            sortedEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < now;
                const item = document.createElement('div');
                item.className = 'timeline-event';
                if (isPast) {
                    item.classList.add('is-past');
                } else {
                    item.classList.add('is-clickable');
                    if (!nextEventMarked) {
                        item.id = 'next-social-event';
                        nextEventMarked = true;
                    }
                    item.addEventListener('click', () => {
                        const icsString = generateICS(event);
                        const filename = `${event.name.replace(/\s/g, '_')}.ics`;
                        downloadToFile(icsString, filename);
                    });
                }
                const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' });
                item.innerHTML = `<div class="event-date">${formattedDate}</div><div class="event-name">${event.name}</div>`;
                timelineContainer.appendChild(item);
            });
            eventsSection.appendChild(timelineContainer);
            socialContentContainer.appendChild(eventsSection);
        }

        const separator2 = document.createElement('hr');
        separator2.className = 'content-separator fade-in-up';
        socialContentContainer.appendChild(separator2);

        if (socialData.barOpeningTimes) {
            const openingTimesSection = document.createElement('div');
            openingTimesSection.className = 'content-section fade-in-up';
            const title = document.createElement('h3');
            title.className = 'content-subtitle';
            title.textContent = 'Bar Opening Times';
            openingTimesSection.appendChild(title);
            const tabsNav = document.createElement('div');
            tabsNav.className = 'tabs-nav';
            openingTimesSection.appendChild(tabsNav);
            const tabsContent = document.createElement('div');
            tabsContent.className = 'tabs-content';
            openingTimesSection.appendChild(tabsContent);
            const createTimesList = (seasonData) => {
                const listContainer = document.createElement('div');
                listContainer.className = 'times-list';
                seasonData.times.forEach(item => {
                    const timeEntry = document.createElement('div');
                    timeEntry.className = 'time-entry fade-in-up';
                    timeEntry.dataset.day = item.day;
                    const hoursHtml = item.hours.map(h => `<span>${h}</span>`).join('<br>');
                    timeEntry.innerHTML = `<p class="day-name">${item.day}</p><p class="hours-list">${hoursHtml}</p>`;
                    listContainer.appendChild(timeEntry);
                });
                return listContainer;
            };
            const seasons = { summer: { icon: icons.sun }, winter: { icon: icons.snowflake } };
            Object.keys(seasons).forEach((seasonKey, index) => {
                if (socialData.barOpeningTimes[seasonKey]) {
                    const seasonData = socialData.barOpeningTimes[seasonKey];
                    const button = document.createElement('button');
                    button.className = 'tab-button';
                    button.innerHTML = `${seasons[seasonKey].icon} ${seasonData.period}`;
                    button.dataset.target = `${seasonKey}-times-panel`;
                    tabsNav.appendChild(button);
                    const panel = document.createElement('div');
                    panel.id = `${seasonKey}-times-panel`;
                    panel.className = 'tab-panel';
                    panel.appendChild(createTimesList(seasonData));
                    tabsContent.appendChild(panel);
                    if (index === 0) {
                        button.classList.add('is-active');
                        panel.classList.add('is-active');
                    }
                }
            });
            tabsNav.addEventListener('click', (e) => {
                const button = e.target.closest('.tab-button');
                if (button) {
                    tabsNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('is-active'));
                    tabsContent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
                    button.classList.add('is-active');
                    const targetPanel = document.getElementById(button.dataset.target);
                    if (targetPanel) {
                        targetPanel.classList.add('is-active');
                        animateTimeEntries(targetPanel);
                    }
                }
            });
            socialContentContainer.appendChild(openingTimesSection);
        }

        const separator3 = document.createElement('hr');
        separator3.className = 'content-separator fade-in-up';
        socialContentContainer.appendChild(separator3);

        const fbContact = contactsData.clubContacts.find(c => c.name === "Facebook Page");
        if (fbContact && fbContact.value) {
            const banner = document.createElement('div');
            banner.className = 'info-banner fade-in-up';
            const bannerText = "For the latest updates and fun night details, check the Social Notice Board and our [Facebook Page].";
            const linkHtml = `<a href="${fbContact.value}" target="_blank" rel="noopener noreferrer">Facebook Page</a>`;
            banner.innerHTML = `
                <div class="info-banner-icon">${icons.facebook}</div>
                <p>${bannerText.replace('[Facebook Page]', linkHtml)}</p>
            `;
            socialContentContainer.appendChild(banner);
        }

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[new Date().getDay()];
        const todayEntries = document.querySelectorAll(`.time-entry[data-day*="${todayName}"]`);
        todayEntries.forEach(entry => {
            entry.classList.add('is-today');
        });

        if (window.innerWidth >= 992) {
            const timelineContainer = document.querySelector('.vertical-timeline');
            const nextEventElement = document.getElementById('next-social-event');
            if (timelineContainer && nextEventElement) {
                const scrollPosition = nextEventElement.offsetLeft - (timelineContainer.offsetWidth / 2) + (nextEventElement.offsetWidth / 2);
                setTimeout(() => {
                    timelineContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                }, 500);
            }
        }

        const animatedElements = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('content-section') || entry.target.classList.contains('content-separator') || entry.target.classList.contains('info-banner')) {
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                    }
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));

        const initialPanel = document.querySelector('.tab-panel.is-active');
        if (initialPanel) {
            setTimeout(() => animateTimeEntries(initialPanel), 200);
        }

        // --- THIS IS THE CORRECTED CODE ---
        // It runs directly inside the .then() block, after everything is created.
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Use a small timeout to ensure the browser has finished rendering the new content
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150); 
            }
        }
    })
    .catch(error => {
        console.error("Failed to load page data:", error);
        socialContentContainer.innerHTML = '<p>Error: Could not load social page content.</p>';
    });
});