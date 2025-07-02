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

    const galleryContainer = document.getElementById('photo-gallery-container');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!galleryContainer || !modal) return;

    const isMobile = window.innerWidth < 768;

    const albumObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                albumObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const photoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                photoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fetch('../../data/photos.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            galleryContainer.innerHTML = '';
            data.albums.sort((a, b) => new Date(b.date) - new Date(a.date));

            data.albums.forEach((album, albumIndex) => {
                const albumWrapper = document.createElement('div');
                albumWrapper.className = 'album-wrapper';
                albumWrapper.style.transitionDelay = `${albumIndex * 0.15}s`;
                
                const albumHeader = document.createElement('div');
                albumHeader.className = 'album-header';
                const albumTitle = document.createElement('h3');
                albumTitle.className = 'album-title';
                albumTitle.textContent = album.name;
                const albumDate = document.createElement('span');
                albumDate.className = 'album-date';
                const date = new Date(album.date);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                albumDate.textContent = date.toLocaleDateString('en-GB', options);
                albumHeader.appendChild(albumTitle);
                albumHeader.appendChild(albumDate);
                albumWrapper.appendChild(albumHeader);

                if (album.description) {
                    const albumDescription = document.createElement('p');
                    albumDescription.className = 'album-description';
                    albumDescription.textContent = album.description;
                    albumWrapper.appendChild(albumDescription);
                }

                if (isMobile) {
                    renderMobileSlider(album, albumWrapper);
                } else {
                    renderDesktopGrid(album, albumWrapper);
                }

                galleryContainer.appendChild(albumWrapper);
                albumObserver.observe(albumWrapper);
            });
            
            // Initialize all Swiper instances after they are on the page
            if (isMobile) {
                new Swiper('.swiper', {
                    loop: true,
                    pagination: {
                      el: '.swiper-pagination',
                      clickable: true,
                    },
                    navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    },
                });
            }
        })
        .catch(error => {
            console.error("Error fetching or processing photos data:", error);
            galleryContainer.innerHTML = '<p>Error: Could not load the photo gallery. Please try again later.</p>';
        });

    function renderDesktopGrid(album, wrapper) {
        const photoGrid = document.createElement('div');
        photoGrid.className = 'photo-grid';
        album.photos.forEach((photo, photoIndex) => {
            const photoPath = `../../data/photos/${album.folder}/${photo.filename}`;
            const captionText = photo.caption || '';
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.innerHTML = `<img src="${photoPath}" alt="${captionText}" loading="lazy"><div class="photo-caption">${captionText}</div>`;
            photoCard.style.transitionDelay = `${photoIndex * 0.05}s`;
            photoObserver.observe(photoCard);
            photoCard.addEventListener('click', () => openLightbox(photoPath, captionText));
            photoGrid.appendChild(photoCard);
        });
        wrapper.appendChild(photoGrid);
    }

    function renderMobileSlider(album, wrapper) {
        // Create the specific HTML structure Swiper requires
        const swiperContainer = document.createElement('div');
        swiperContainer.className = 'swiper';

        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';

        album.photos.forEach(photo => {
            const photoPath = `../../data/photos/${album.folder}/${photo.filename}`;
            const captionText = photo.caption || '';
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img src="${photoPath}" alt="${captionText}" loading="lazy">`;
            slide.addEventListener('click', () => openLightbox(photoPath, captionText));
            swiperWrapper.appendChild(slide);
        });

        swiperContainer.appendChild(swiperWrapper);
        
        // Add navigation and pagination elements
        const pagination = document.createElement('div');
        pagination.className = 'swiper-pagination';
        const prevBtn = document.createElement('div');
        prevBtn.className = 'swiper-button-prev';
        const nextBtn = document.createElement('div');
        nextBtn.className = 'swiper-button-next';

        swiperContainer.appendChild(pagination);
        swiperContainer.appendChild(prevBtn);
        swiperContainer.appendChild(nextBtn);

        wrapper.appendChild(swiperContainer);
    }

    function openLightbox(src, caption) {
        modal.style.display = 'block';
        modalImg.src = src;
        modalCaption.textContent = caption;
    }

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });
});