document.addEventListener('DOMContentLoaded', () => {
    const introElement = document.getElementById('page-intro');
    const clubContactsContainer = document.getElementById('club-contacts-container');
    const externalLinksContainer = document.getElementById('external-links-container');

    // --- NEW: Helper function to get an icon based on the contact type ---
    const getIcon = (type) => {
        switch (type) {
            case 'phone':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
            case 'email':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
            case 'link':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>';
            case 'download':
                return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>';
            default:
                return '';
        }
    };

    fetch('../../data/contacts.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {

            introElement.textContent = data.pageIntro;

            // --- MODIFIED: Render the new, detailed club contact cards ---
            clubContactsContainer.innerHTML = ''; 
            data.clubContacts.forEach(contact => {
                let linkHtml = '';
                if (contact.type === 'phone') {
                    linkHtml = `<a href="tel:${contact.value}" class="contact-card-value">${contact.value}</a>`;
                } else if (contact.type === 'email') {
                    linkHtml = `<a href="mailto:${contact.value}" class="contact-card-value">${contact.value}</a>`;
                } else if (contact.type === 'link') {
                    linkHtml = `<a href="${contact.value}" target="_blank" rel="noopener noreferrer" class="contact-card-value">Visit Page</a>`;
                } else if (contact.type === 'download') {
                    linkHtml = `<a href="${contact.value}" download class="contact-card-value">Download Form</a>`;
                }

                const contactCardHtml = `
                    <div class="contact-card">
                        <div class="contact-card-icon">
                            ${getIcon(contact.type)}
                        </div>
                        <div class="contact-card-content">
                            <h3 class="contact-card-title">${contact.name}</h3>
                            ${linkHtml}
                        </div>
                    </div>
                `;
                clubContactsContainer.innerHTML += contactCardHtml;
            });

            // Render the external links (they already use a suitable card format)
            externalLinksContainer.innerHTML = '';
            data.externalLinks.forEach(link => {
                const linkCard = `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="feature-card" style="text-decoration: none;">
                        <div class="feature-icon-wrapper">
                           ${getIcon('link')}
                        </div>
                        <h3 class="feature-title" style="text-align: center;">${link.name}</h3>
                    </a>
                `;
                externalLinksContainer.innerHTML += linkCard;
            });
        })
        .catch(error => {
            console.error("Error fetching or processing contacts data:", error);
            clubContactsContainer.innerHTML = '<p>Error: Could not load contact information. Please try again later.</p>';
        });
});