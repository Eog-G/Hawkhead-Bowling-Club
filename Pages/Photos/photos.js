document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('photo-gallery-container');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!galleryContainer || !modal) return;

    const isMobile = window.innerWidth < 768;

    // Set up the observer to watch for elements coming into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop watching it once it's visible
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    fetch('../../data/photos.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            galleryContainer.innerHTML = ''; // Clear content
            data.albums.sort((a, b) => new Date(b.date) - new Date(a.date));

            data.albums.forEach((album, albumIndex) => {
                const albumWrapper = document.createElement('div');
                albumWrapper.className = 'album-wrapper';
                
                // Set the transition delay for the stagger effect
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

                if (isMobile) {
                    renderMobileSlider(album, albumIndex, albumWrapper);
                } else {
                    renderDesktopGrid(album, albumWrapper);
                }

                galleryContainer.appendChild(albumWrapper);
                
                // Tell the observer to start watching this new album wrapper
                observer.observe(albumWrapper);
            });
            
            if (isMobile) {
                document.querySelectorAll('.slider-container').forEach(setupSlider);
            }
        })
        .catch(error => {
            console.error("Error fetching or processing photos data:", error);
            galleryContainer.innerHTML = '<p>Error: Could not load the photo gallery. Please try again later.</p>';
        });

    function renderDesktopGrid(album, wrapper) {
        const photoGrid = document.createElement('div');
        photoGrid.className = 'photo-grid';
        album.photos.forEach(photo => {
            const photoPath = `../../data/photos/${album.folder}/${photo.filename}`;
            const captionText = photo.caption || '';
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.innerHTML = `<img src="${photoPath}" alt="${captionText}" loading="lazy"><div class="photo-caption">${captionText}</div>`;
            photoCard.addEventListener('click', () => openLightbox(photoPath, captionText));
            photoGrid.appendChild(photoCard);
        });
        wrapper.appendChild(photoGrid);
    }

    function renderMobileSlider(album, albumIndex, wrapper) {
        const sliderId = `slider-${albumIndex}`;
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        sliderContainer.id = sliderId;
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';
        album.photos.forEach(photo => {
            const photoPath = `../../data/photos/${album.folder}/${photo.filename}`;
            const captionText = photo.caption || '';
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${photoPath}" alt="${captionText}" loading="lazy"><p class="slide-caption">${captionText}</p>`;
            slide.addEventListener('click', () => openLightbox(photoPath, captionText));
            sliderWrapper.appendChild(slide);
        });
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        album.photos.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.dataset.slide = i;
            dotsContainer.appendChild(dot);
        });
        sliderContainer.innerHTML = `<button class="slider-btn prev">‹</button><button class="slider-btn next">›</button>`;
        sliderContainer.insertBefore(sliderWrapper, sliderContainer.firstChild);
        sliderContainer.appendChild(dotsContainer);
        wrapper.appendChild(sliderContainer);
    }
    
    function setupSlider(slider) {
        const wrapper = slider.querySelector('.slider-wrapper');
        const slides = slider.querySelectorAll('.slide');
        const dots = slider.querySelectorAll('.dot');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentIndex = 0;
        let startX = 0;
        let endX = 0;
        function showSlide(index) {
            if (index >= slides.length) currentIndex = 0;
            if (index < 0) currentIndex = slides.length - 1;
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }
        prevBtn.addEventListener('click', () => { currentIndex--; showSlide(currentIndex); });
        nextBtn.addEventListener('click', () => { currentIndex++; showSlide(currentIndex); });
        dots.forEach(dot => dot.addEventListener('click', (e) => { currentIndex = parseInt(e.target.dataset.slide); showSlide(currentIndex);}));
        wrapper.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        wrapper.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; });
        wrapper.addEventListener('touchend', () => {
            if (startX - endX > 50) { currentIndex++; showSlide(currentIndex); } 
            else if (endX - startX > 50) { currentIndex--; showSlide(currentIndex); }
        });
        showSlide(0);
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