document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileLinks = document.querySelectorAll(".mobile-nav-links a");
    const body = document.body;

    function toggleMenu() {
        const isOpen = mobileNav.classList.toggle("open");
        body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    function closeMenu() {
        mobileNav.classList.remove("open");
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", toggleMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close mobile nav on window resize if it's open and screen gets larger
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900 && mobileNav.classList.contains("open")) {
            closeMenu();
        }
    });

    /* ==========================================================================
       Header Shrink on Scroll
       ========================================================================== */
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters view
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       Active Nav Link on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky header
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    /* ==========================================================================
       Video Modal
       ========================================================================== */
    const videoModal = document.getElementById("videoModal");
    const modalIframe = document.getElementById("modalIframe");
    const playButtons = document.querySelectorAll(".play-story-btn");
    const closeBtn = document.querySelector(".video-modal-close");
    const modalBackdrop = document.querySelector(".video-modal-backdrop");
    
    // YouTube video URL (a beautiful documentary style video on green tech/renewables)
    const videoEmbedUrl = "https://www.youtube.com/embed/kJpqi169hL8?autoplay=1&mute=0";

    function openModal() {
        modalIframe.setAttribute("src", videoEmbedUrl);
        videoModal.classList.add("active");
        body.classList.add("menu-open"); // Prevent background scrolling
    }

    function closeModal() {
        videoModal.classList.remove("active");
        body.classList.remove("menu-open");
        // Clear src to stop video playing in background
        modalIframe.setAttribute("src", "");
    }

    playButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoModal.classList.contains("active")) {
            closeModal();
        }
    });

    /* ==========================================================================
       Application Form Validation & Success State
       ========================================================================== */
    const form = document.getElementById("applicationForm");
    const formContainer = document.querySelector(".form-container");

    // Clear invalid styling when user modifies inputs
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            const formGroup = input.parentElement;
            formGroup.classList.remove("invalid");
        });
        
        input.addEventListener("change", () => {
            const formGroup = input.parentElement;
            formGroup.classList.remove("invalid");
        });
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function validateUrl(url) {
        // Basic url validation
        try {
            new URL(url.startsWith('http') ? url : 'https://' + url);
            return true;
        } catch (_) {
            return false;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach((input) => {
            const formGroup = input.parentElement;
            const value = input.value.trim();

            if (input.hasAttribute("required") && !value) {
                formGroup.classList.add("invalid");
                isFormValid = false;
            } else if (input.type === "email" && value && !validateEmail(value)) {
                formGroup.classList.add("invalid");
                isFormValid = false;
            } else if (input.type === "url" && value && !validateUrl(value)) {
                formGroup.classList.add("invalid");
                isFormValid = false;
            } else {
                formGroup.classList.remove("invalid");
            }
        });

        if (isFormValid) {
            // Trigger loading state on button
            const submitBtn = form.querySelector(".submit-btn");
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.classList.add("loading");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Application...</span> <i class="ri-loader-4-line ri-spin"></i>`;

            // Simulate form submission network request
            setTimeout(() => {
                // Fade out form and replace with custom success animation
                formContainer.style.transition = "opacity 0.4s ease";
                formContainer.style.opacity = "0";

                setTimeout(() => {
                    formContainer.innerHTML = `
                        <div class="form-success-container">
                            <div class="success-check-circle">
                                <i class="ri-checkbox-circle-line"></i>
                            </div>
                            <h3>Application Received!</h3>
                            <p>
                                Thank you for reaching out to GreenioTalk. Our editorial team will review your company profile and proposed story.
                            </p>
                            <p style="margin-top: 12px; font-size: 0.9rem; opacity: 0.8;">
                                We will get back to you at <strong>${form.email.value.trim()}</strong> within 3-5 business days to coordinate a potential feature.
                            </p>
                        </div>
                    `;
                    formContainer.style.opacity = "1";
                }, 400);

            }, 1800); // 1.8 seconds delay
        } else {
            // Scroll to the first invalid field
            const firstInvalid = form.querySelector(".form-group.invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
});
