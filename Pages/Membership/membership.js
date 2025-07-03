document.addEventListener('DOMContentLoaded', () => {

    const formContainer = document.getElementById('form-container');
    const formHeader = document.getElementById('form-header');
    const formSubheader = document.getElementById('form-subheader');
    const downloadSection = document.getElementById('download-section');
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');

    Promise.all([
        fetch('../../data/membership.json').then(res => res.json()),
        fetch('../../data/contacts.json').then(res => res.json())
    ])
    .then(([membershipData, contactsData]) => {
        
        const clubEmail = contactsData.clubContacts.find(c => c.name === "Club Email")?.value || 'default-email@example.com';
        const formPath = contactsData.clubContacts.find(c => c.name === "Membership Application")?.value || '#';
        const clubAddress = contactsData.clubContacts.find(c => c.name === "Club Address")?.value;

        pageTitle.textContent = membershipData.pageTitle;
        pageDescription.setAttribute('content', membershipData.pageDescription);
        formHeader.textContent = membershipData.formHeader;
        formSubheader.textContent = membershipData.formSubheader;

        const form = document.createElement('form');
        form.id = 'membership-form';
        
        membershipData.fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            if (field.type === 'separator') {
                const separator = document.createElement('hr');
                separator.className = 'content-separator-card';
                form.appendChild(separator);
                return;
            }

            const label = document.createElement('label');
            label.htmlFor = field.name;
            label.textContent = field.label;
            
            let input;
            switch(field.type) {
                case 'textarea':
                    input = document.createElement('textarea');
                    input.rows = field.rows || 3;
                    break;
                case 'select':
                    input = document.createElement('select');
                    const placeholder = document.createElement('option');
                    placeholder.value = "";
                    placeholder.textContent = field.placeholder || 'Select...';
                    placeholder.disabled = true;
                    placeholder.selected = true;
                    input.appendChild(placeholder);
                    field.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        input.appendChild(option);
                    });
                    break;
                case 'checkbox':
                    group.classList.add('checkbox-group');
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    break;
                default:
                    input = document.createElement('input');
                    input.type = field.type;
                    if(field.placeholder) input.placeholder = field.placeholder;
            }
            
            input.id = field.name;
            input.name = field.name;
            if (field.required) input.required = true;
            if (field.readonly) input.readOnly = true;

            if (field.type === 'checkbox') {
                group.appendChild(input);
                group.appendChild(label);
            } else {
                group.appendChild(label);
                group.appendChild(input);
            }

            if (field.conditionalOn) {
                group.id = `${field.name}-agreement`;
                group.classList.add('hidden');
            }

            form.appendChild(group);
        });
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'button button-primary';
        submitButton.textContent = membershipData.submitButtonText || 'Submit';
        
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'form-group';
        buttonWrapper.appendChild(submitButton);
        form.appendChild(buttonWrapper);

        formContainer.appendChild(form);
        
        if (membershipData.downloadSection) {
            const dsHeader = document.createElement('h3');
            dsHeader.className = 'content-subtitle';
            dsHeader.textContent = membershipData.downloadSection.header;

            const dsText = document.createElement('p');
            dsText.textContent = membershipData.downloadSection.text;

            const dsButton = document.createElement('a');
            dsButton.className = 'button button-secondary';
            dsButton.href = formPath; 
            dsButton.textContent = membershipData.downloadSection.buttonText;
            dsButton.download = formPath.split('/').pop();

            downloadSection.appendChild(dsHeader);
            downloadSection.appendChild(dsText);
            downloadSection.appendChild(dsButton);

            if (clubAddress) {
                const addressContainer = document.createElement('div');
                addressContainer.className = 'postal-address';
                const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="address-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
                
                addressContainer.innerHTML = `
                    ${locationIcon}
                    <p><strong>Hawkhead Bowling Club</strong></p>
                    <p>${clubAddress.replace(/\n/g, '<br>')}</p>
                `;
                downloadSection.appendChild(addressContainer);
            }
        }
        
        initializeFormLogic(clubEmail);

    })
    .catch(error => {
        console.error("Could not fetch page data:", error);
        formContainer.innerHTML = '<p>Sorry, the application form could not be loaded at this time.</p>';
    });

    function initializeFormLogic(clubEmail) {
        const membershipForm = document.getElementById('membership-form');
        const membershipType = document.getElementById('membershipType');
        const playingMemberAgreement = document.getElementById('playingMember-agreement');
        const playingMemberCheckbox = document.getElementById('playingMember');
        const dateField = document.getElementById('date');
        
        if (dateField && !dateField.value) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            dateField.value = `${day}/${month}/${year}`;
        }

        if (membershipType && playingMemberAgreement) {
            membershipType.addEventListener('change', () => {
                const selectedType = membershipType.value;
                if (selectedType === 'Full Playing Lady' || selectedType === 'Full Playing Gent') {
                    playingMemberAgreement.classList.remove('hidden');
                    playingMemberAgreement.classList.add('instant-show'); // Add class for instant animation
                    playingMemberCheckbox.required = true;
                } else {
                    playingMemberAgreement.classList.add('hidden');
                    playingMemberAgreement.classList.remove('instant-show');
                    playingMemberCheckbox.required = false;
                }
            });
        }

        if (membershipForm) {
            membershipForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                const subject = 'New Membership Application';
                const body = `
New Membership Application from the website:

Name of Applicant: ${data.fullName}
Membership Type: ${data.membershipType}
E-Signature: ${data.signature}
Date of Application: ${data.date}

Address: ${data.address}
Postcode: ${data.postcode}
Email: ${data.email}
Telephone: ${data.phone}
Date of Birth: ${data.dob || 'Not provided'}

---------------------------------

CONFIRMATIONS:
- I confirm I have never been refused membership of, or expelled from, any Bowls Scotland affiliated club: ${data.expelled ? 'Yes' : 'No'}
- I agree not to join another affiliated bowling club as a playing member without first resigning from Hawkhead Bowling Club: ${data.playingMember ? 'Yes' : 'N/A'}
- I consent to my contact details being included in the Club’s internal directory: ${data.directory ? 'Yes' : 'No'}
                `;
                window.location.href = `mailto:${clubEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            });
        }
    }
});