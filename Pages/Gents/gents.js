document.addEventListener('DOMContentLoaded', () => {
    const gentsContentContainer = document.getElementById('gents-content-container');

    // --- Icon definitions ---
    const icons = {
        president: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>',
        champion: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>'
    };

    fetch('../../data/gents.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // --- 1. Page Description ---
            if (data.pageDescription) {
                const introParagraph = document.createElement('p');
                introParagraph.className = 'page-description fade-in-up'; // Add animation class
                introParagraph.textContent = data.pageDescription;
                gentsContentContainer.appendChild(introParagraph);
            }

            // --- 2. Key People Cards ---
            if (data.keyPeople && data.keyPeople.length > 0) {
                const keyPeopleContainer = document.createElement('div');
                keyPeopleContainer.className = 'key-people-container';

                data.keyPeople.forEach(person => {
                    const card = document.createElement('div');
                    card.className = 'key-person-card fade-in-up'; // Add animation class
                    
                    let iconHtml = '';
                    if (person.title.toLowerCase().includes('president')) {
                        iconHtml = icons.president;
                    } else if (person.title.toLowerCase().includes('champion')) {
                        iconHtml = icons.champion;
                    }
                    
                    card.innerHTML = `
                        <div class="key-person-icon">
                            ${iconHtml}
                        </div>
                        <div class="key-person-details">
                            <p class="key-person-title">${person.title} - ${person.year}</p>
                            <p class="key-person-name">${person.name}</p>
                        </div>
                    `;
                    keyPeopleContainer.appendChild(card);
                });
                gentsContentContainer.appendChild(keyPeopleContainer);
            }

            // --- 3. Content Separator ---
            const separator = document.createElement('hr');
            separator.className = 'content-separator fade-in-up'; // Add animation class
            gentsContentContainer.appendChild(separator);


            // --- 4. Intersection Observer for Animations (NEW) ---
            const animatedElements = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Apply a sequential delay to each element
                        entry.target.style.transitionDelay = `${index * 150}ms`;
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            }, {
                threshold: 0.1 // Trigger when 10% of the element is visible
            });

            animatedElements.forEach(el => observer.observe(el));
        })
        .catch(error => {
            console.error('Error fetching or processing gents data:', error);
            gentsContentContainer.innerHTML = '<p>Error loading page content.</p>';
        });
});