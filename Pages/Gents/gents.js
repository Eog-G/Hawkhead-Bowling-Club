document.addEventListener('DOMContentLoaded', () => {
    const gentsContentContainer = document.getElementById('gents-content-container');

    const icons = {
        president: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
        champion: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>'
    };

    fetch('../../data/gents.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.pageDescription) {
                const introParagraph = document.createElement('p');
                introParagraph.className = 'page-description fade-in-up';
                introParagraph.textContent = data.pageDescription;
                gentsContentContainer.appendChild(introParagraph);
            }

            if (data.keyPeople && data.keyPeople.length > 0) {
                const keyPeopleContainer = document.createElement('div');
                keyPeopleContainer.className = 'key-people-container';
                data.keyPeople.forEach(person => {
                    const card = document.createElement('div');
                    card.className = 'key-person-card fade-in-up';
                    let iconHtml = '';
                    if (person.title.toLowerCase().includes('president')) iconHtml = icons.president;
                    else if (person.title.toLowerCase().includes('champion')) {
                        iconHtml = icons.champion;
                        card.id = 'champion-card';
                    }
                    card.innerHTML = `<div class="key-person-icon">${iconHtml}</div><div class="key-person-details"><p class="key-person-title">${person.title} - ${person.year}</p><p class="key-person-name">${person.name}</p></div>`;
                    keyPeopleContainer.appendChild(card);
                });
                gentsContentContainer.appendChild(keyPeopleContainer);
            }
            
            // --- Separator 1 ---
            const separator1 = document.createElement('hr');
            separator1.className = 'content-separator fade-in-up';
            gentsContentContainer.appendChild(separator1);

            if (data.committee && data.committee.length > 0) {
                const committeeSection = document.createElement('div');
                committeeSection.className = 'content-section fade-in-up';
                const title = document.createElement('h3');
                title.className = 'content-subtitle';
                title.textContent = 'Gents Committee 2025';
                committeeSection.appendChild(title);
                const gridContainer = document.createElement('div');
                gridContainer.className = 'committee-grid';
                data.committee.forEach(member => {
                    const card = document.createElement('div');
                    card.className = 'committee-member-card';
                    card.innerHTML = `<p class="member-role">${member.role}</p><p class="member-name">${member.name}</p>`;
                    gridContainer.appendChild(card);
                });
                committeeSection.appendChild(gridContainer);
                gentsContentContainer.appendChild(committeeSection);
            }
            
            // --- Separator 2 ---
            const separator2 = document.createElement('hr');
            separator2.className = 'content-separator fade-in-up';
            gentsContentContainer.appendChild(separator2);

            if (data.outdoorEvents && data.outdoorEvents.length > 0) {
                const eventsSection = document.createElement('section');
                eventsSection.className = 'events-section fade-in-up';
                const title = document.createElement('h3');
                title.className = 'content-subtitle';
                title.textContent = '2025 Outdoor Events';
                eventsSection.appendChild(title);
                const timelineContainer = document.createElement('div');
                timelineContainer.className = 'vertical-timeline';
                const sortedEvents = data.outdoorEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                const now = new Date();
                sortedEvents.forEach(event => {
                    const eventDate = new Date(event.date);
                    const item = document.createElement('div');
                    item.className = 'timeline-event';
                    if (eventDate < now) {
                        item.classList.add('is-past');
                    }
                    const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                    item.innerHTML = `<div class="event-date">${formattedDate}</div><div class="event-name">${event.name}</div>`;
                    timelineContainer.appendChild(item);
                });
                eventsSection.appendChild(timelineContainer);
                gentsContentContainer.parentElement.appendChild(eventsSection);
            }

            // --- Animation Observer ---
            const animatedElements = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                        entry.target.classList.add('is-visible');
                        if (entry.target.id === 'champion-card') {
                            setTimeout(() => { party.confetti(entry.target, { count: party.variation.range(40, 60) }); }, 400);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => observer.observe(el));

            const championCard = document.getElementById('champion-card');
            if (championCard) {
                championCard.addEventListener('click', function () {
                    party.confetti(this, { count: party.variation.range(40, 60), size: party.variation.range(0.8, 1.2), speed: party.variation.range(300, 500) });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching or processing gents data:', error);
            gentsContentContainer.innerHTML = '<p>Error loading page content.</p>';
        });
});