/**
 * Oscar Sainz - Personal Website
 * Modern JavaScript with improved UX
 */

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeScrollProgress();
    initializeCurrentYear();
    loadPublications();
});

// ===== Current Year =====
function initializeCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ===== Theme Toggle =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', initialTheme);
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition class for smooth color changes
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// ===== Navigation =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    // Navbar background on scroll
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                highlightNavOnScroll();
                updateNavbarOnScroll();
                scrollTimeout = null;
            }, 50);
        }
    });
    
    // Initial call
    highlightNavOnScroll();
    updateNavbarOnScroll();
}

// ===== Smooth Scrolling =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('visible'));
    }
}

// ===== Back to Top Button =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('btn-back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
            setTimeout(() => {
                if (!backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                toggleBackToTop();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    toggleBackToTop();
}

// ===== Scroll Progress =====
function initializeScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ===== Load Publications from Semantic Scholar API =====
function loadPublications() {
    const publicationList = document.getElementById('publication-list');
    if (!publicationList) return;
    
    const API_URL = 'https://api.semanticscholar.org/graph/v1/author/1724648481/papers?fields=url,title,year,authors,citationCount,venue,publicationDate';
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const publications = data.data || [];
            
            // Sort by citation count (descending)
            publications.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));
            
            // Take top 10
            const topPublications = publications.slice(0, 10);
            
            if (topPublications.length === 0) {
                publicationList.innerHTML = '<p class="no-publications">No publications found.</p>';
                return;
            }
            
            // Generate HTML
            const html = topPublications.map(pub => createPublicationCard(pub)).join('');
            publicationList.innerHTML = html;
            
            // Animate cards
            const cards = publicationList.querySelectorAll('.publication-item');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in');
            });
        })
        .catch(error => {
            console.error('Error fetching publications:', error);
            publicationList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load publications. Please check my 
                    <a href="https://scholar.google.es/citations?user=3Z5zok8AAAAJ&hl=es" target="_blank">Google Scholar</a> 
                    page directly.</p>
                </div>
            `;
        });
}

function createPublicationCard(publication) {
    // Format authors
    const authors = publication.authors
        .map(author => {
            const name = author.name || 'Unknown';
            return name === 'Oscar Sainz' 
                ? `<strong>${name}</strong>` 
                : name;
        })
        .join(', ');
    
    // Format venue
    const venue = publication.venue || 'Preprint';
    const truncatedVenue = venue.length > 50 ? venue.substring(0, 47) + '...' : venue;
    
    // Format citations
    const citations = publication.citationCount || 0;
    
    return `
        <article class="publication-item">
            <h5>
                <a href="${publication.url}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(publication.title)}
                </a>
            </h5>
            <p class="authors">${authors}</p>
            <div class="publication-meta">
                <span class="pub-year">${publication.year || 'N/A'}</span>
                <span class="pub-venue" title="${escapeHtml(venue)}">${escapeHtml(truncatedVenue)}</span>
                ${citations > 0 ? `<span class="pub-citations"><i class="fas fa-quote-left"></i> ${citations}</span>` : ''}
            </div>
        </article>
    `;
}

// ===== Utility Functions =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Add some extra polish =====
// Prevent FOUC (Flash of Unstyled Content)
document.documentElement.classList.add('js-loaded');

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle?.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Add fade-in animation CSS
const style = document.createElement('style');
style.textContent = `
    .publication-item.fade-in {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error-message {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-tertiary);
    }
    
    .error-message i {
        font-size: 2rem;
        margin-bottom: 16px;
        color: #ef4444;
    }
    
    .no-publications {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-tertiary);
    }
    
    .theme-transitioning * {
        transition: background-color 0.3s ease, border-color 0.3s ease !important;
    }
    
    #btn-back-to-top {
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    #btn-back-to-top.visible {
        opacity: 1;
    }
`;
document.head.appendChild(style);