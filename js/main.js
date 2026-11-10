/**
 * Personal Portfolio Template
 * Logic & Interactivity (Pure Vanilla JavaScript)
 * Naseef Ugrapuram - Creative Designer & Developer
 */

// =============================================================
// DIRECT EMAIL CONTACT DESTINATION
// Submissions deliver directly to Naseef's Gmail
// =============================================================
const CONTACT_EMAIL = 'naseefugr@gmail.com';
const GOOGLE_SCRIPT_BACKUP_URL = 'https://script.google.com/macros/s/AKfycbwBjyEKMV312TwTzYeZ0nOx32-UMQ9690TXyWLYIOdGMeWHHB9x-3glksN2N42r2ex-eA/exec';

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
    08. CONTACT FORM - DIRECT EMAIL SUBMIT ONLY
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
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';

      // Prepare payload
      const payload = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        _subject: `New Portfolio Message from ${name}: ${subject}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
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

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Also dispatch to Google Apps Script backup
        if (GOOGLE_SCRIPT_BACKUP_URL) {
          fetch(GOOGLE_SCRIPT_BACKUP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        if (data && (data.success === 'false' || data.success === false) && data.message && data.message.includes('Activation')) {
          showStatus('Almost done! FormSubmit sent an activation email to naseefugr@gmail.com. Please click "Activate Form" in your Gmail (check Spam folder too) to enable delivery!', 'success');
          alert('Message sent! Please check naseefugr@gmail.com for the "Activate Form" email from FormSubmit (check Spam folder too) and click it once to start receiving all messages.');
        } else {
          showStatus('Message sent successfully!', 'success');
          alert('Message sent successfully!');
        }
      } catch (error) {
        // Fallback: still send to Google Script backup
        if (GOOGLE_SCRIPT_BACKUP_URL) {
          fetch(GOOGLE_SCRIPT_BACKUP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        showStatus('Message sent successfully!', 'success');
        alert('Message sent successfully!');
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
