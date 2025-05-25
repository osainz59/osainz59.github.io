document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Toggle mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener("click", function() {
        navMenu.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add animation delay to sections
    sections.forEach((section, index) => {
        section.classList.add('animate__delay-' + (index * 1.) + 's');
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            setTimeout(() => {
                const mobileNav = document.querySelector('.mobile-nav');
                const activeLink = document.querySelector('.mobile-nav a.active');
                if (activeLink && mobileNav) {
                    const scrollLeft = activeLink.offsetLeft - (mobileNav.offsetWidth / 2) + (activeLink.offsetWidth / 2);
                    mobileNav.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    });
});

//Get the button
let back_to_top_btn = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        back_to_top_btn.style.display = "block";
    } else {
        back_to_top_btn.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
back_to_top_btn.addEventListener("click", backToTop);

function backToTop() {
    targetElement = document.querySelector("header");
    // Scroll to the header element smoothly
    targetElement.scrollIntoView({
        behavior: "smooth"
    });
}

function compare_paper(a, b) {
    return b.citationCount - a.citationCount;
}

// Load publications
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        publications_data = xhttp.response.data;
        publications_data.sort(compare_paper);

        let pub_html = document.getElementById("publication-list")
        let i = 0;
        for (publication of publications_data) {
            if (i >= 10) break;

            let _html = '<div class="publication-item">';
            _html += '<h5><a href="' + publication.url + '" target="_blank">' + publication.title + '</a></h5>';
            
            let authors = "";
            for (author of publication.authors) {
                if (author.name != "Oscar Sainz") {
                    authors += author.name + ", ";
                } else {
                    authors += "<strong>" + author.name + "</strong>, ";
                }
            }
            authors = authors.slice(0, -2);
            
            _html += '<p class="mb-1">' + authors + '</p>';
            _html += '<div class="d-flex publication-meta justify-content-between align-items-center gap-2">';
            _html += '<span class="badge bg-light text-dark">' + publication.year + '</span> ';
            
            // Add the venue badge with ellipsis class
            _html += '<span class="badge bg-primary venue-badge" title="' + publication.venue + '">' + 
                      publication.venue + '</span>';
            
            _html += '</div>';
            _html += '</div>';
            
            pub_html.innerHTML += _html;
            i++;
        }
    }
};
xhttp.open("GET", "https://api.semanticscholar.org/graph/v1/author/1724648481/papers?fields=url,title,year,authors,citationCount,venue,citationStyles,publicationDate", true);
xhttp.send();

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem('theme');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set the initial theme
if (savedTheme) {
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else if (prefersDarkMode) {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    updateThemeIcon('dark');
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update the icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
    } else {
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
    }
}

// Update theme icon when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    updateThemeIcon(currentTheme);
});