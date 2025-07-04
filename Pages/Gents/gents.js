document.addEventListener('DOMContentLoaded', () => {
    const gentsContentContainer = document.getElementById('gents-content-container');

    // --- HELPER FUNCTIONS ---
    function generateICS(event) {
        const eventDate = new Date(event.date);
        const year = eventDate.getFullYear();
        const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
        const day = eventDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        const uid = `${formattedDate}-${event.name.replace(/\s/g, '')}@hawkhead-bowling-club.com`;
        const now = new Date();
        const dtstamp = now.getUTCFullYear() + (now.getUTCMonth() + 1).toString().padStart(2, '0') + now.getUTCDate().toString().padStart(2, '0') + 'T' + now.getUTCHours().toString().padStart(2, '0') + now.getUTCMinutes().toString().padStart(2, '0') + now.getUTCSeconds().toString().padStart(2, '0') + 'Z';
        const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HawkheadBowlingClub//Website//EN', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtstamp}`, `DTSTART;VALUE=DATE:${formattedDate}`, `DTEND;VALUE=DATE:${formattedDate}`, `SUMMARY:${event.name}`, `DESCRIPTION:Event: ${event.name} at Hawkhead Bowling Club`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
        return icsContent;
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

    function animateResultCards(panelElement) {
        if (!panelElement) return;
        const cards = panelElement.querySelectorAll('.result-card');
        cards.forEach(card => {
            card.classList.remove('is-visible');
        });
        setTimeout(() => {
            cards.forEach((card, index) => {
                card.style.transitionDelay = `${index * 75}ms`;
                card.classList.add('is-visible');
            });
        }, 10); 
    }

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
                    if (!member.name || member.name.trim() === '') {
                        card.classList.add('is-vacant');
                        card.innerHTML = `
                            <p class="member-role">${member.role}</p>
                            <p class="member-name">Vacant</p>
                        `;
                    } else {
                        card.innerHTML = `
                            <p class="member-role">${member.role}</p>
                            <p class="member-name">${member.name}</p>
                        `;
                    }

                    gridContainer.appendChild(card);
                });
                committeeSection.appendChild(gridContainer);
                gentsContentContainer.appendChild(committeeSection);
            }
            
            const separator2 = document.createElement('hr');
            separator2.className = 'content-separator fade-in-up';
            gentsContentContainer.appendChild(separator2);

            if (data.outdoorEvents && data.outdoorEvents.length > 0) {
                const eventsSection = document.createElement('section');
                eventsSection.className = 'events-section fade-in-up';
                eventsSection.id = 'gents-events-timeline';
                const title = document.createElement('h3');
                title.className = 'content-subtitle';
                title.textContent = '2025 Outdoor Events';
                eventsSection.appendChild(title);
                const note = document.createElement('p');
                note.className = 'timeline-note';
                note.innerHTML = '💡 Click on any upcoming event to add it to your calendar.';
                eventsSection.appendChild(note);
                const timelineContainer = document.createElement('div');
                timelineContainer.className = 'vertical-timeline';
                const sortedEvents = data.outdoorEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
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
                            item.id = 'next-upcoming-event';
                            nextEventMarked = true;
                        }
                        item.addEventListener('click', () => {
                            const icsString = generateICS(event);
                            const filename = `${event.name.replace(/\s/g, '_')}.ics`;
                            downloadToFile(icsString, filename);
                        });
                    }
                    const formattedDate = eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                    item.innerHTML = `<div class="event-date">${formattedDate}</div><div class="event-name">${event.name}</div>`;
                    timelineContainer.appendChild(item);
                });
                eventsSection.appendChild(timelineContainer);
                gentsContentContainer.parentElement.appendChild(eventsSection);
            }

            const separator3 = document.createElement('hr');
            separator3.className = 'content-separator fade-in-up';
            gentsContentContainer.parentElement.appendChild(separator3);
            
            if (data.outdoorResults || data.shortCarpetResults) {
                const resultsSection = document.createElement('section');
                resultsSection.className = 'results-section fade-in-up';
                gentsContentContainer.parentElement.appendChild(resultsSection);

                const resultsTitle = document.createElement('h3');
                resultsTitle.className = 'content-subtitle';
                resultsTitle.textContent = 'Competition Results';
                resultsSection.appendChild(resultsTitle);

                const tabsNav = document.createElement('div');
                tabsNav.className = 'tabs-nav';
                resultsSection.appendChild(tabsNav);

                const tabsContent = document.createElement('div');
                tabsContent.className = 'tabs-content';
                resultsSection.appendChild(tabsContent);
                
                const createResultsGrid = (resultData) => {
                    if (!resultData || !resultData.competitions) return null;
                    const gridContainer = document.createElement('div');
                    gridContainer.className = 'results-grid';
                    resultData.competitions.forEach(comp => {
                        const card = document.createElement('div');
                        card.className = 'result-card fade-in-up';
                        const winnerLabel = comp.winner.length > 1 ? 'Winners' : 'Winner';
                        const runnerUpLabel = comp.runnerUp && comp.runnerUp.length > 1 ? 'Runners Up' : 'Runner Up';

                        let runnerUpHtml = '';
                        if (comp.runnerUp && comp.runnerUp.length > 0) {
                            runnerUpHtml = `
                                <div class="result-entry">
                                    <div class="result-icon silver">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.477 8.124a.5.5 0 0 0-.707 0L12 10.899l-2.77-2.775a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 0 .707l2.775 2.77L9.414 15.47a.5.5 0 0 0 0 .707l1.414 1.414a.5.5 0 0 0 .707 0L14.309 14.82l2.77-2.775a.5.5 0 0 0 0-.707l-1.414-1.414z"/><circle cx="12" cy="12" r="10"/></svg>
                                    </div>
                                    <div class="result-details">
                                        <p class="result-label">${runnerUpLabel}</p>
                                        <p class="result-names">${comp.runnerUp.join(', ')}</p>
                                    </div>
                                </div>`;
                        }
                        card.innerHTML = `
                            <h4 class="competition-name">${comp.name}</h4>
                            <div class="result-entry">
                                <div class="result-icon gold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>
                                </div>
                                <div class="result-details">
                                    <p class="result-label">${winnerLabel}</p>
                                    <p class="result-names">${comp.winner.join(', ')}</p>
                                </div>
                            </div>
                            ${runnerUpHtml}`;
                        gridContainer.appendChild(card);
                    });
                    return gridContainer;
                };

                const resultTypes = [{ key: 'outdoorResults', title: 'Outdoor Results' }, { key: 'shortCarpetResults', title: 'Short Carpet Results' }];
                
                resultTypes.forEach((type, index) => {
                    if (data[type.key]) {
                        const button = document.createElement('button');
                        button.className = 'tab-button';
                        button.textContent = `${type.title} ${data[type.key].year}`;
                        button.dataset.target = `${type.key}-panel`;
                        tabsNav.appendChild(button);
                        const panel = document.createElement('div');
                        panel.id = `${type.key}-panel`;
                        panel.className = 'tab-panel';
                        const grid = createResultsGrid(data[type.key]);
                        if (grid) panel.appendChild(grid);
                        tabsContent.appendChild(panel);
                        if (index === 0) {
                            button.classList.add('is-active');
                            panel.classList.add('is-active');
                        }
                    }
                });

                tabsNav.addEventListener('click', (e) => {
                    if (e.target.matches('.tab-button')) {
                        tabsNav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('is-active'));
                        tabsContent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
                        e.target.classList.add('is-active');
                        const targetPanel = document.getElementById(e.target.dataset.target);
                        if(targetPanel) {
                            targetPanel.classList.add('is-active');
                            animateResultCards(targetPanel);
                        }
                    }
                });
                
                const initialPanel = tabsContent.querySelector('.tab-panel.is-active');
                if (initialPanel) {
                    setTimeout(() => animateResultCards(initialPanel), 200);
                }
            }
            
            // *** UPDATED ANIMATION LOGIC ***
            
            // Check if we should suppress the initial confetti animation because of a URL hash
            const suppressConfetti = window.location.hash === '#gents-events-timeline';

            if (window.innerWidth >= 992) {
                const timelineContainer = document.querySelector('.vertical-timeline');
                const nextEventElement = document.getElementById('next-upcoming-event');
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
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                        entry.target.classList.add('is-visible');
                        
                        // Only play confetti if the flag is not set
                        if (entry.target.id === 'champion-card' && !suppressConfetti) {
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

            // Scroll to hash element on page load
            if (window.location.hash) {
                const id = window.location.hash.substring(1);
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150); 
                }
            }
        })
        .catch(error => {
            console.error('Error fetching or processing gents data:', error);
            gentsContentContainer.innerHTML = '<p>Error loading page content.</p>';
        });
});