document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('page-title');
    const subtitleElement = document.getElementById('page-subtitle');
    const contentContainer = document.getElementById('about-content-container');

    fetch('../../data/about.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            titleElement.textContent = data.title;
            subtitleElement.textContent = data.subtitle;

            data.sections.forEach(sectionData => {
                const block = document.createElement('div');
                block.className = 'content-block';

                const title = document.createElement('h3');
                title.className = 'content-block-title';
                title.textContent = sectionData.title;
                block.appendChild(title);

                if (sectionData.type === 'intro') {
                    const content = document.createElement('p');
                    content.innerHTML = sectionData.content;
                    block.appendChild(content);
                } else if (sectionData.type === 'affiliations') {
                    const grid = document.createElement('div');
                    grid.className = 'affiliations-grid';
                    sectionData.items.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'affiliation-card';
                        card.innerHTML = `
                            <p class="affiliation-card-name">${item.name}</p>
                            <p class="affiliation-card-body">${item.body}</p>
                        `;
                        grid.appendChild(card);
                    });
                    block.appendChild(grid);
                } else if (sectionData.type === 'history') {
                    const timeline = document.createElement('div');
                    timeline.className = 'history-timeline';
                    sectionData.events.forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'history-event';
                        eventDiv.innerHTML = `
                            <p class="history-year">${event.year}</p>
                            <p class="history-description">${event.description}</p>
                        `;
                        timeline.appendChild(eventDiv);
                    });
                    block.appendChild(timeline);
                }
                contentContainer.appendChild(block);
            });
            
            // Add fade-in animations
            const animatedElements = document.querySelectorAll('.content-block');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animatedElements.forEach(el => observer.observe(el));
        })
        .catch(error => {
            console.error('Error fetching or processing about page data:', error);
            contentContainer.innerHTML = '<p>Error loading content.</p>';
        });
});