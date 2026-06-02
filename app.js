/* ==========================================================================
   Bellup Online Tuition - Interactive Site Logic
   Features: GSAP ScrollTrigger, Kids Zone Quiz, Booking Wizard, Floating Bubbles
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize background bubbles
  createBackgroundBubbles();

  // Scroll handler for translucent header
  initHeaderScroll();

  // Mobile Drawer Menu toggle
  initMobileDrawer();

  // Mouse Parallax for floating elements
  initMouseParallax();

  // Initialize Interactive Quiz
  initKidsQuiz();

  // Initialize GSAP Animations
  initGsapAnimations();
});

/* ==========================================================================
   Background Bubble Generator
   ========================================================================== */
function createBackgroundBubbles() {
  const container = document.getElementById("bubble-bg");
  if (!container) return;

  const bubbleCount = 20;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    // Randomize bubble features
    const size = Math.random() * 80 + 20; // 20px - 100px
    const left = Math.random() * 100;    // 0% - 100%
    const delay = Math.random() * 10;    // 0s - 10s
    const duration = Math.random() * 15 + 10; // 10s - 25s

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.animationDuration = `${duration}s`;

    container.appendChild(bubble);
  }
}

/* ==========================================================================
   Header Scroll Styling
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.getElementById("hamburger-btn");
  const closeBtn = document.getElementById("close-drawer-btn");
  const drawer = document.getElementById("mobile-drawer");
  const drawerLinks = document.querySelectorAll(".drawer-link, .drawer-btn-cta");

  if (!hamburger || !drawer) return;

  const openDrawer = () => drawer.classList.add("open");
  const closeDrawer = () => drawer.classList.remove("open");

  hamburger.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

  // Close drawer if user clicks outside of it
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("open") && 
        !drawer.contains(e.target) && 
        !hamburger.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   Mouse Movement Parallax (Micro-interactions)
   ========================================================================== */
function initMouseParallax() {
  const floatItems = document.querySelectorAll(".float-item");
  const mascotImg = document.querySelector(".mascot-img");
  
  let lastX = 0;
  let lastY = 0;
  const minDistance = 14; // pixels moved before drawing smoke

  window.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.03;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.03;

    floatItems.forEach((item, index) => {
      // Slightly different multiplier for each item to look dynamic
      const factor = (index + 1) * 0.4;
      item.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });

    if (mascotImg) {
      mascotImg.style.transform = `translate(${moveX * 0.2}px, ${moveY * 0.2}px)`;
    }

    // Cursor smoke tail calculation
    const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (distance > minDistance) {
      createSmokePuff(e.pageX, e.pageY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
}

function createSmokePuff(x, y) {
  const puff = document.createElement("div");
  puff.classList.add("smoke-puff");

  // Offset slightly down-left relative to the 16x16 center hotspot
  puff.style.left = `${x - 16}px`;
  puff.style.top = `${y + 8}px`;

  // Randomize initial smoke diameter slightly for organic texture
  const size = Math.random() * 6 + 6; // 6px - 12px
  puff.style.width = `${size}px`;
  puff.style.height = `${size}px`;

  document.body.appendChild(puff);

  // Remove element after CSS fade animation finishes
  setTimeout(() => {
    puff.remove();
  }, 800);
}

/* ==========================================================================
   Kids Challenge Zone (Interactive Quiz)
   ========================================================================== */
const quizQuestions = [
  {
    question: "If you have 3 apples and Ollie gives you 4 more, how many apples do you have? 🍎",
    options: ["5 Apples", "6 Apples", "7 Apples", "8 Apples"],
    correct: 2,
    xp: 100
  },
  {
    question: "Which planet do we live on? 🌍",
    options: ["Mars", "Jupiter", "Earth", "The Moon"],
    correct: 2,
    xp: 150
  },
  {
    question: "Which animal is known to say 'Meow'? 🐱",
    options: ["Dog", "Cat", "Lion", "Elephant"],
    correct: 1,
    xp: 150
  }
];

let currentQuestionIndex = 0;
let quizScore = 0;
let userAnswers = [];

function initKidsQuiz() {
  loadQuestion();
}

function loadQuestion() {
  const questionBox = document.getElementById("quiz-question-box");
  const successScreen = document.getElementById("quiz-success-screen");
  
  if (!questionBox || !successScreen) return;

  questionBox.classList.remove("hidden");
  successScreen.classList.add("hidden");

  const currentQ = quizQuestions[currentQuestionIndex];
  
  // Update progress
  document.getElementById("current-q-num").textContent = currentQuestionIndex + 1;
  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

  // Update question text
  document.getElementById("quiz-question-text").textContent = currentQ.question;

  // Render options
  const optionsList = document.getElementById("quiz-options-list");
  optionsList.innerHTML = "";

  currentQ.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.classList.add("quiz-option-btn");
    btn.textContent = option;
    btn.setAttribute("onclick", `selectOption(${index})`);
    optionsList.appendChild(btn);
  });
}

function selectOption(selectedIndex) {
  const currentQ = quizQuestions[currentQuestionIndex];
  const optionButtons = document.querySelectorAll(".quiz-option-btn");

  // Disable all buttons immediately to prevent multiple clicks
  optionButtons.forEach(btn => btn.removeAttribute("onclick"));

  if (selectedIndex === currentQ.correct) {
    // Correct choice
    optionButtons[selectedIndex].classList.add("correct-choice");
    quizScore += currentQ.xp;
    document.getElementById("score-info").textContent = `Score: ${quizScore} XP`;
    
    // Mini confetti burst for answer delight
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.7 }
    });
  } else {
    // Wrong choice
    optionButtons[selectedIndex].classList.add("wrong-choice");
    optionButtons[currentQ.correct].classList.add("correct-choice");
  }

  // Go to next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      showQuizSuccess();
    }
  }, 1500);
}

function showQuizSuccess() {
  document.getElementById("quiz-question-box").classList.add("hidden");
  const successScreen = document.getElementById("quiz-success-screen");
  successScreen.classList.remove("hidden");

  // Big Confetti Explosion!
  var duration = 3 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

function restartQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  document.getElementById("score-info").textContent = `Score: 0 XP`;
  loadQuestion();
}

/* ==========================================================================
   Multi-Step Booking Wizard
   ========================================================================== */
let bookingCurrentStep = 1;

function goToStep(step) {
  // Validate step transitions
  if (step > bookingCurrentStep) {
    if (bookingCurrentStep === 1) {
      // Checked grade radio exists
      const grade = document.querySelector('input[name="child_grade"]:checked');
      if (!grade) return;
    }
    if (bookingCurrentStep === 2) {
      const subject = document.querySelector('input[name="child_subject"]:checked');
      if (!subject) return;
    }
  }

  // Update step views
  document.getElementById(`form-step-${bookingCurrentStep}`).classList.add("hidden");
  document.getElementById(`form-step-${step}`).classList.remove("hidden");

  // Update indicators
  updateIndicators(step);
  bookingCurrentStep = step;
}

function updateIndicators(step) {
  // Reset all
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`indicator-step-${i}`);
    indicator.classList.remove("active", "completed");
    if (i < step) {
      indicator.classList.add("completed");
    } else if (i === step) {
      indicator.classList.add("active");
    }
  }
}

function handleBookingSubmit(event) {
  event.preventDefault();

  // Get data
  const grade = document.querySelector('input[name="child_grade"]:checked').value;
  const subject = document.querySelector('input[name="child_subject"]:checked').value;
  const parentName = document.getElementById("parent_name").value;
  const parentEmail = document.getElementById("parent_email").value;
  const parentPhone = document.getElementById("parent_phone").value;
  const startDate = document.getElementById("preferred_date").value;

  // Simulate success feedback
  document.getElementById("form-step-3").classList.add("hidden");
  
  // Inject values into success screen
  document.getElementById("success-parent-name").textContent = parentName;
  document.getElementById("success-subject").textContent = subject;
  document.getElementById("success-email").textContent = parentEmail;
  
  // Show success step
  document.getElementById("booking-success-message").classList.remove("hidden");
  updateIndicators(4); // Completes all steps visually

  // Celebrate booking!
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}

function restartBookingWizard() {
  // Reset form inputs
  document.getElementById("booking-wizard-form").reset();
  
  // Hide success panel
  document.getElementById("booking-success-message").classList.add("hidden");
  
  // Reset active step
  bookingCurrentStep = 1;
  document.getElementById("form-step-1").classList.remove("hidden");
  updateIndicators(1);
}

/* ==========================================================================
   GSAP ScrollTrigger & Page Animations
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === "undefined") return;

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section load animations
  const heroTl = gsap.timeline();
  heroTl.from(".badge-tagline", { y: -20, opacity: 0, duration: 0.6, ease: "power2.out" })
        .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .from(".hero-description", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
        .from(".bullet-item", { x: -30, opacity: 0, duration: 0.4, stagger: 0.15, ease: "power2.out" }, "-=0.4")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .from(".hero-trust", { opacity: 0, duration: 0.6 }, "-=0.2")
        .from(".mascot-orbit-wrapper", { scale: 0.8, opacity: 0, duration: 1, ease: "elastic.out(1, 0.7)" }, "-=0.8");

  // Stats Counters count-up animation
  const statsElements = document.querySelectorAll(".stat-number");
  statsElements.forEach(stat => {
    const target = parseFloat(stat.getAttribute("data-target"));
    const decimals = parseInt(stat.getAttribute("data-decimals")) || 0;
    
    gsap.fromTo(stat, 
      { textContent: 0 }, 
      {
        textContent: target,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        snap: { textContent: 1 },
        onUpdate: function() {
          const val = parseFloat(this.targets()[0].textContent);
          this.targets()[0].textContent = val.toFixed(decimals) + (decimals === 0 ? "+" : "★");
        }
      }
    );
  });

  // Why choose us cards reveal
  gsap.from(".feature-card", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#why-choose",
      start: "top 80%"
    }
  });

  // Kids Zone challenge entrance
  gsap.from(".quiz-container", {
    scale: 0.95,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#kids-zone",
      start: "top 75%"
    }
  });

  // Course cards tab toggle click event setup
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active classes
      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));

      // Add active to current
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const activePane = document.getElementById(`tab-${targetTab}`);
      activePane.classList.add("active");

      // Animate course cards entry inside the active tab
      gsap.from(activePane.querySelectorAll(".course-card"), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
      });
    });
  });

  // Course section header and cards scroll trigger
  gsap.from("#tab-primary .course-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#courses",
      start: "top 75%"
    }
  });

  // How it works timeline animated progress bar
  const timelineFill = document.getElementById("timeline-line-fill");
  const steps = document.querySelectorAll(".timeline-step");

  if (timelineFill) {
    gsap.to(timelineFill, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline-container",
        start: "top 20%",
        end: "bottom 80%",
        scrub: true,
        onUpdate: (self) => {
          // Highlight steps based on scroll progress
          const progress = self.progress;
          steps.forEach((step, index) => {
            const stepThreshold = index / (steps.length - 1);
            if (progress >= stepThreshold - 0.1) {
              step.classList.add("active");
            } else {
              step.classList.remove("active");
            }
          });
        }
      }
    });
  }

  // Tutors profile card reveal
  gsap.from(".tutor-card", {
    scale: 0.9,
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.25,
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: ".tutors-section",
      start: "top 80%"
    }
  });

  // Booking wizard entrance
  gsap.from(".booking-wrapper", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#booking-section",
      start: "top 75%"
    }
  });
}
