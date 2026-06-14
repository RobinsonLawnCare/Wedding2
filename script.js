document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRSVPHandler();
    initCarousels();
});

/**
 * Manages Tab Switching Engine (Single Page Application Behavior)
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            // Remove active status from previous navigation tabs
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Remove active status from previous viewable pages
            sections.forEach(section => section.classList.remove('active'));

            // Grant active status to current selection
            link.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Scroll cleanly to the top of the context window
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/**
 * Helper function enabling explicit target switches from external page buttons
 */
function navigateToPage(targetId) {
    const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if (targetLink) {
        targetLink.click();
    }
}

/**
 * Handles Conditional Form Logic & Formspree Submission Execution
 */
function initRSVPHandler() {
    const form = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('successMessage');
    const attendanceRadios = document.getElementsByName('attendance');
    const dietaryGroup = document.getElementById('dietaryGroup');
    const songGroup = document.getElementById('songGroup'); // Handled safely if commented out

    // Display or hide questions dynamically based on "Accepts" vs "Declines"
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'no') {
                if (dietaryGroup) dietaryGroup.classList.add('hidden');
                if (songGroup) songGroup.classList.add('hidden');
                
                // Clear inputs if they hide the form fields
                const guestCountInput = document.getElementById('number-of-people');
                if (guestCountInput) guestCountInput.value = '';
                
                const songInput = document.getElementById('songRequest');
                if (songInput) songInput.value = '';
            } else {
                if (dietaryGroup) dietaryGroup.classList.remove('hidden');
                if (songGroup) songGroup.classList.remove('hidden');
            }
        });
    });

    // Formspree submission handler using Fetch API
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard, clunky page reloads

            // Automatically bundles up all fields with a "name" attribute
            const data = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update user interface to show success state
                    form.classList.add('hidden');
                    successMsg.classList.remove('hidden');
                    form.reset(); 
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your RSVP. Please try again.");
                        }
                    });
                }
            })
            .catch(error => {
                alert("Oops! There was a network issue connecting to the server. Please try again.");
            });
        });
    }
}

/**
 * Manages Multi-Carousel Components independently
 */
function initCarousels() {
    const containers = document.querySelectorAll('.carousel-container');

    containers.forEach(container => {
        const track = container.querySelector('.carousel-track');
        if (!track) return; // Skip if track structure isn't setup

        const slides = Array.from(track.children);
        const nextBtn = container.querySelector('.carousel-btn.next');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        let currentIndex = 0;

        // Function to move the sliding track
        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Seamless loop back to the first photo
                }
                moveToSlide(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = slides.length - 1; // Seamless jump back to the final photo
                }
                moveToSlide(currentIndex);
            });
        }
    });
}