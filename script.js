document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.7)';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Portfolio Category Gallery System
    // ========================================
    const portfolioCards = document.querySelectorAll('.portfolio-card[data-category]');
    const galleryShowcase = document.getElementById('gallery-showcase');
    const galleryTitle = document.getElementById('gallery-section-title');
    const galleryBackBtn = document.getElementById('gallery-back-btn');
    const categoryGalleries = document.querySelectorAll('.category-gallery');
    let activeCategory = null;

    // Category name mapping
    const categoryNames = {
        'logos': '🎨 Logos',
        'publication-materials': '📰 Publication Materials',
        'banners-tarpaulins': '🖼️ Banners & Tarpaulins',
        'standee-banner': '🧍 Standee Banner Layout',
        'videos': '🎞️ Videos',
        'presentations': '📊 Presentations',
        'facebook-frame': '📱 Facebook Frame',
        'youtube-thumbnail': '⏯️ YouTube Thumbnail',
        'invitations': '✉️ Invitations',
        'programs': '📋 Programs',
        'ids': '🪪 IDs',
        'others': '✨ Others'
    };

    // Handle card clicks
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;

            // If clicking the same category, close it
            if (activeCategory === category) {
                closeGallery();
                return;
            }

            // Set active state
            portfolioCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Show the gallery
            activeCategory = category;
            galleryShowcase.classList.add('is-active');
            galleryTitle.textContent = categoryNames[category] || category;

            // Show only the matching gallery
            categoryGalleries.forEach(g => {
                g.classList.remove('is-active');
                if (g.dataset.gallery === category) {
                    g.classList.add('is-active');
                }
            });

            // Scroll to gallery
            setTimeout(() => {
                const navbarHeight = 80;
                const galleryTop = galleryShowcase.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({
                    top: galleryTop,
                    behavior: 'smooth'
                });
            }, 100);
        });
    });

    // Back button
    galleryBackBtn.addEventListener('click', closeGallery);

    function closeGallery() {
        activeCategory = null;
        portfolioCards.forEach(c => c.classList.remove('active'));
        galleryShowcase.classList.remove('is-active');
        categoryGalleries.forEach(g => g.classList.remove('is-active'));
    }

    // ========================================
    // Lightbox Modal System
    // ========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentLightboxItems = [];
    let currentLightboxIndex = 0;

    // Gather all lightbox-able items and attach click handlers
    document.querySelectorAll('.masonry-item[data-lightbox]').forEach(item => {
        item.addEventListener('click', () => {
            // Gather all visible lightbox items in the active gallery
            const activeGallery = document.querySelector('.category-gallery.is-active');
            if (!activeGallery) return;

            currentLightboxItems = Array.from(activeGallery.querySelectorAll('.masonry-item[data-lightbox]'));
            currentLightboxIndex = currentLightboxItems.indexOf(item);

            openLightbox();
        });
    });

    function openLightbox() {
        if (currentLightboxItems.length === 0) return;

        const item = currentLightboxItems[currentLightboxIndex];
        const src = item.dataset.lightbox;
        const caption = item.querySelector('.item-overlay span')?.textContent || '';

        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        // Show/hide nav buttons
        lightboxPrev.style.display = currentLightboxItems.length > 1 ? 'flex' : 'none';
        lightboxNext.style.display = currentLightboxItems.length > 1 ? 'flex' : 'none';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('is-active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function navigateLightbox(direction) {
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxItems.length - 1;
        if (currentLightboxIndex >= currentLightboxItems.length) currentLightboxIndex = 0;

        const item = currentLightboxItems[currentLightboxIndex];
        const src = item.dataset.lightbox;
        const caption = item.querySelector('.item-overlay span')?.textContent || '';

        // Add a quick transition
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = src;
            lightboxCaption.textContent = caption;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on overlay click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target === document.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('is-active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
});
