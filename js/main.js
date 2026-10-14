/**
 * Personal Portfolio Template
 * Logic & Interactivity (Pure Vanilla JavaScript)
 * Naseef Ugrapuram - Creative Designer & Developer
 */

// =============================================================
// GOOGLE SHEETS SETUP CONFIGURATION
// 1. Follow the instructions in GOOGLE_SHEETS_SETUP.md
// 2. Paste your deployed Google Apps Script Web App URL below:
// =============================================================
const GOOGLE_SHEET_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /*=============================================================
    01. PRELOADER
  =============================================================*/
  const preloader = document.getElementById('preloader');
  
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  };

  // Trigger on full page load, with safety fallback
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1800);

  /*=============================================================
    02. STICKY NAVBAR & SCROLLSPY
  =============================================================*/
  const navbar = document.getElementById('navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const topControl = document.getElementById('scrollTop');

  const onScrollHandler = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Sticky header
    if (scrollY > 50) {
      navbar.classList.add('navbar-fixed');
    } else {
      navbar.classList.remove('navbar-fixed');
    }

    // Scroll to Top button visibility
    if (topControl) {
      if (scrollY > 350) {
        topControl.classList.add('show');
      } else {
        topControl.classList.remove('show');
      }
    }

    // Scrollspy active state
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollHandler);
  onScrollHandler();

  /*=============================================================
    03. MOBILE NAVIGATION DRAWER
  =============================================================*/
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  /*=============================================================
    04. SMOOTH SCROLLING FOR ANCHORS
  =============================================================*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  if (topControl) {
    topControl.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /*=============================================================
    05. ANIMATED CIRCULAR SKILL DIALS
  =============================================================*/
  const skillCards = document.querySelectorAll('.skill-card');
  let animatedSkills = false;

  const animateSkills = () => {
    skillCards.forEach(card => {
      const circle = card.querySelector('.progress-circle');
      const percentEl = card.querySelector('.skill-percent');
      const targetPercent = parseInt(card.getAttribute('data-percent'), 10) || 0;
      
      const circumference = 345; // 2 * Math.PI * 55
      const offset = circumference - (targetPercent / 100) * circumference;

      if (circle) {
        circle.style.strokeDashoffset = offset;
      }

      // Numeric count-up
      let currentPercent = 0;
      const duration = 1500;
      const intervalTime = 20;
      const step = Math.ceil(targetPercent / (duration / intervalTime));

      const timer = setInterval(() => {
        currentPercent += step;
        if (currentPercent >= targetPercent) {
          currentPercent = targetPercent;
          clearInterval(timer);
        }
        if (percentEl) {
          percentEl.textContent = `${currentPercent}%`;
        }
      }, intervalTime);
    });
  };

  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedSkills) {
          animatedSkills = true;
          animateSkills();
        }
      });
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsSection);
  } else {
    animateSkills();
  }

  /*=============================================================
    06. PORTFOLIO MODAL LIGHTBOX
  =============================================================*/
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const projectCards = document.querySelectorAll('.single-project');
  const openProjectBtns = document.querySelectorAll('.open-project-btn');

  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');
  const modalClient = document.getElementById('modalClient');
  const modalCategory = document.getElementById('modalCategory');
  const modalDate = document.getElementById('modalDate');
  const modalUrl = document.getElementById('modalUrl');

  const openModal = (projectCard) => {
    const title = projectCard.getAttribute('data-title') || 'Project Title';
    const category = projectCard.getAttribute('data-category-name') || 'Poster Design';
    const imgSrc = projectCard.getAttribute('data-img') || '';
    const desc = projectCard.getAttribute('data-desc') || 'Project overview and details.';
    const client = projectCard.getAttribute('data-client') || 'Client Project';
    const date = projectCard.getAttribute('data-date') || 'Recent';
    const url = projectCard.getAttribute('data-url') || '#';

    if (modalTitle) modalTitle.textContent = title;
    if (modalImage) modalImage.src = imgSrc;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalClient) modalClient.textContent = client;
    if (modalCategory) modalCategory.textContent = category;
    if (modalDate) modalDate.textContent = date;
    if (modalUrl) {
      modalUrl.textContent = url;
      modalUrl.href = url.startsWith('http') ? url : '#';
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectCard = btn.closest('.single-project');
      if (projectCard) openModal(projectCard);
    });
  });

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /*=============================================================
    07. TESTIMONIALS SLIDER
  =============================================================*/
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('sliderDots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoSlideInterval;

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const updateDots = (index) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      if (currentIndex >= slides.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = slides.length - 1;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots(currentIndex);
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();

    track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    track.addEventListener('mouseleave', startAutoSlide);

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        resetAutoSlide();
      } else if (touchEndX - touchStartX > 50) {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
      }
    }, { passive: true });
  }

  /*=============================================================
    08. CONTACT FORM - GOOGLE SHEETS INTEGRATION
  =============================================================*/
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.elements['name'].value.trim();
      const email = contactForm.elements['email'].value.trim();
      const subject = contactForm.elements['subject'].value.trim();
      const message = contactForm.elements['message'].value.trim();
      const timestamp = new Date().toLocaleString();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving Message...';

      // Prepare payload
      const payload = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: timestamp
      };

      // Local backup in browser storage
      try {
        const stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        stored.push(payload);
        localStorage.setItem('portfolio_messages', JSON.stringify(stored));
      } catch (err) {
        console.warn('Local storage not available', err);
      }

      // Check if Google Sheet URL is configured
      const isConfigured = GOOGLE_SHEET_SCRIPT_URL &&
                           GOOGLE_SHEET_SCRIPT_URL.startsWith('http') &&
                           !GOOGLE_SHEET_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE');

      if (isConfigured) {
        try {
          await fetch(GOOGLE_SHEET_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          showStatus(`Thank you, ${name}! Your message has been saved to the Google Sheet. I will reply soon.`, 'success');
          contactForm.reset();
        } catch (error) {
          console.error('Error submitting to Google Sheet:', error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          showStatus(`Message saved locally! However, unable to reach Google Sheet. Please check the Web App URL.`, 'error');
        }
      } else {
        // Fallback demo response if user hasn't added Web App URL yet
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          showStatus(`Thank you, ${name}! Your message has been recorded. (Note: To send directly to your Google Sheet, paste your Web App URL into js/main.js as explained in GOOGLE_SHEETS_SETUP.md)`, 'success');
          contactForm.reset();
        }, 800);
      }
    });

    const showStatus = (msg, type) => {
      if (formStatus) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 8000);
        }
      }
    };
  }
});
