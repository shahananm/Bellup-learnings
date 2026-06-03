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

  // Initialize Children Playground Canvas Animation
  initChildrenPlayground();
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

  // Offset to match the exhaust of the scooter cursor (which is at +22px X and +14px Y relative to the hotspot)
  const xOffset = 22 + (Math.random() * 4 - 2); // add minor jitter
  const yOffset = 14 + (Math.random() * 4 - 2);
  puff.style.left = `${x + xOffset}px`;
  puff.style.top = `${y + yOffset}px`;

  // Randomize initial smoke diameter slightly for organic texture
  const size = Math.random() * 8 + 6; // 6px - 14px
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

/* ==========================================================================
   Children's Animated Playground Canvas
   ========================================================================== */
function initChildrenPlayground() {
  const canvas = document.getElementById("children-playground");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  // Hill shape function
  const getHillY = (x) => {
    return height - 30 + Math.sin(x * 0.005) * 12 + Math.cos(x * 0.002) * 5;
  };

  // Handle Resize
  window.addEventListener("resize", () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
  });

  // Particle Class for bursts
  class BurstParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = (Math.random() - 0.5) * 6 - 2;
      this.size = Math.random() * 4 + 2;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1; // gravity
      this.alpha -= this.decay;
    }
    draw(c) {
      c.save();
      c.globalAlpha = this.alpha;
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  // Floating Target Class (Letters, numbers, stars)
  class FloatingTarget {
    constructor(char, x, baseY, color) {
      this.char = char;
      this.x = x;
      this.baseY = baseY;
      this.y = baseY;
      this.color = color;
      this.floatAngle = Math.random() * Math.PI * 2;
      this.floatSpeed = 0.03 + Math.random() * 0.02;
      this.floatHeight = 15 + Math.random() * 10;
    }
    update() {
      this.floatAngle += this.floatSpeed;
      this.y = this.baseY + Math.sin(this.floatAngle) * this.floatHeight;
    }
    draw(c) {
      c.save();
      c.fillStyle = this.color;
      c.shadowBlur = 8;
      c.shadowColor = this.color;
      c.font = "bold 20px 'Fredoka', sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(this.char, this.x, this.y);
      c.restore();
    }
  }

  // Bouncy Playground Ball
  const ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 12,
    color: "#FF7043", // sunset orange
    active: false,
    gravity: 0.35,
    bounce: 0.72,
    update() {
      if (!this.active) return;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      // Wall collisions
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -this.bounce;
      } else if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -this.bounce;
      }

      // Ground collision
      const groundY = getHillY(this.x);
      if (this.y + this.radius >= groundY) {
        this.y = groundY - this.radius;
        this.vy = -this.vy * this.bounce;
        // Friction on rolls
        this.vx *= 0.98;
        if (Math.abs(this.vy) < 0.8) this.vy = 0;
        
        // Spawn bounce dust/particles
        if (Math.abs(this.vy) > 1.5) {
          for (let i = 0; i < 5; i++) {
            particles.push(new BurstParticle(this.x, groundY, "#26A69A"));
          }
        }
      }
    },
    draw(c) {
      if (!this.active) return;
      c.save();
      // Draw ball gradient
      const grad = c.createRadialGradient(this.x - 3, this.y - 3, 2, this.x, this.y, this.radius);
      grad.addColorStop(0, "#FFA500");
      grad.addColorStop(0.4, "#FF7043");
      grad.addColorStop(1, "#D84315");
      c.fillStyle = grad;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      c.fill();
      
      // Draw beach/playground stripes
      c.strokeStyle = "#FFFFFF";
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, -Math.PI*0.4, Math.PI*0.6);
      c.stroke();
      c.restore();
    }
  };

  // Custom Child Class
  class Child {
    constructor(name, x, color, accessory) {
      this.name = name;
      this.x = x;
      this.y = 0;
      this.speed = 1.6 + Math.random() * 0.8;
      this.color = color;
      this.accessory = accessory; // 'helmet', 'cap', 'pigtails'
      this.size = 13;
      this.jumpY = 0;
      this.jumpSpeed = 0;
      this.isJumping = false;
      this.runCycle = Math.random() * 10;
      this.state = 'running'; // 'running', 'idle', 'jumping', 'waving'
      this.waveCycle = 0;
      this.direction = 1;
      this.isWaving = false;
      this.speechTimer = 0;
      this.speechText = "";
    }

    update() {
      // Waving behavior
      if (this.isWaving) {
        this.state = 'waving';
        this.waveCycle += 0.25;
        if (this.speechTimer > 0) this.speechTimer--;
        return;
      }

      this.runCycle += 0.16;

      // Choose path
      let targetX = this.x;
      if (ball.active) {
        targetX = ball.x;
      } else if (targets.length > 0) {
        let closest = targets[0];
        let minDist = Math.abs(targets[0].x - this.x);
        for (let t of targets) {
          let d = Math.abs(t.x - this.x);
          if (d < minDist) {
            minDist = d;
            closest = t;
          }
        }
        targetX = closest.x;
      }

      // Move
      const dist = targetX - this.x;
      if (Math.abs(dist) > 12) {
        this.direction = Math.sign(dist);
        this.x += this.direction * this.speed;
        this.state = 'running';
      } else {
        this.state = 'idle';
      }

      // Bound within screen
      if (this.x < 20) this.x = 20;
      if (this.x > width - 20) this.x = width - 20;

      // Ground height
      this.y = getHillY(this.x);

      // Jumping
      if (this.isJumping) {
        this.jumpY += this.jumpSpeed;
        this.jumpSpeed += 0.55; // gravity
        if (this.jumpY >= 0) {
          this.jumpY = 0;
          this.isJumping = false;
          this.jumpSpeed = 0;
        }
      } else {
        // Decide to jump
        if (ball.active && Math.abs(ball.x - this.x) < 22 && ball.y < this.y - 15) {
          this.jump();
        } else {
          for (let t of targets) {
            if (Math.abs(t.x - this.x) < 28 && t.y < this.y - 12) {
              this.jump();
            }
          }
        }
      }

      if (this.speechTimer > 0) this.speechTimer--;
    }

    jump() {
      if (!this.isJumping) {
        this.isJumping = true;
        this.jumpSpeed = -8 - Math.random() * 3;
        this.state = 'jumping';
        
        // Random cute word
        if (Math.random() < 0.35) {
          this.say(Math.random() < 0.5 ? "Wheee!" : "Oops!");
        }
      }
    }

    say(text) {
      this.speechText = text;
      this.speechTimer = 90; // 1.5s at 60fps
    }

    draw(c) {
      c.save();
      c.translate(this.x, this.y + this.jumpY - 40); // Offset upwards so legs touch hill

      // Body/Shirt
      c.fillStyle = this.color;
      c.beginPath();
      c.moveTo(-7, 8);
      c.lineTo(7, 8);
      c.lineTo(5, 23);
      c.lineTo(-5, 23);
      c.closePath();
      c.fill();

      // Arms
      c.strokeStyle = '#FFE082'; // Skin
      c.lineWidth = 3.5;
      c.lineCap = 'round';
      if (this.state === 'waving') {
        // wave left arm
        c.beginPath();
        c.moveTo(-4, 9);
        c.lineTo(-9, 15);
        c.moveTo(4, 9);
        const waveX = 9 + Math.sin(this.waveCycle) * 3;
        const waveY = -2 + Math.cos(this.waveCycle) * 2;
        c.lineTo(waveX, waveY);
        c.stroke();
      } else {
        // running arms
        const swing = Math.sin(this.runCycle) * 6;
        c.beginPath();
        c.moveTo(-5, 9);
        c.lineTo(-8 + swing * this.direction, 16 - swing * 0.2);
        c.moveTo(5, 9);
        c.lineTo(8 - swing * this.direction, 16 + swing * 0.2);
        c.stroke();
      }

      // Pants/Legs
      c.strokeStyle = '#3F51B5';
      c.lineWidth = 3.8;
      const legSwingL = Math.sin(this.runCycle) * 7;
      const legSwingR = -Math.sin(this.runCycle) * 7;
      
      // Left leg
      c.beginPath();
      c.moveTo(-3, 23);
      if (this.isJumping) {
        c.lineTo(-4, 30);
        c.lineTo(-1, 31);
      } else {
        c.lineTo(-3 + legSwingL, 33);
      }
      c.stroke();

      // Right leg
      c.beginPath();
      c.moveTo(3, 23);
      if (this.isJumping) {
        c.lineTo(4, 30);
        c.lineTo(7, 31);
      } else {
        c.lineTo(3 + legSwingR, 33);
      }
      c.stroke();

      // Head
      c.fillStyle = '#FFE082';
      c.beginPath();
      c.arc(0, 0, this.size, 0, Math.PI * 2);
      c.fill();

      // Eyes
      c.fillStyle = '#1E1233';
      const lx = this.direction * 2.5;
      c.beginPath();
      c.arc(lx - 2, -1, 1.2, 0, Math.PI * 2);
      c.arc(lx + 2, -1, 1.2, 0, Math.PI * 2);
      c.fill();

      // Smile
      c.strokeStyle = '#1E1233';
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(lx, 2.5, 2.5, 0, Math.PI);
      c.stroke();

      // Accessories
      if (this.accessory === 'helmet') {
        // Red safety helmet
        c.fillStyle = '#FF7043';
        c.beginPath();
        c.arc(0, -3, 14.5, Math.PI, 0);
        c.fill();
        c.strokeStyle = '#FF7043';
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(-13, -3);
        c.lineTo(-3, 10);
        c.lineTo(3, 10);
        c.lineTo(13, -3);
        c.stroke();
      } else if (this.accessory === 'cap') {
        // Green sports cap
        c.fillStyle = '#26A69A';
        c.beginPath();
        c.arc(0, -3, 14, Math.PI, 0);
        c.fill();
        c.beginPath();
        c.ellipse(this.direction * 8, -4, 10, 2.5, this.direction * 0.1, 0, Math.PI * 2);
        c.fill();
      } else if (this.accessory === 'pigtails') {
        // Cute hair bows & pigtails
        c.fillStyle = '#8B4513';
        c.beginPath();
        c.arc(0, -2, 14, Math.PI, 0);
        c.fill();
        c.beginPath();
        c.arc(-13, -3, 5, 0, Math.PI*2);
        c.arc(13, -3, 5, 0, Math.PI*2);
        c.fill();
        c.fillStyle = '#FF7043';
        c.fillRect(-15, -5, 4, 3);
        c.fillRect(11, -5, 4, 3);
      }

      // Speech bubble
      if (this.speechTimer > 0) {
        c.restore();
        c.save();
        c.translate(this.x, this.y + this.jumpY - 95);
        c.fillStyle = "#FFFFFF";
        c.strokeStyle = "#7C4DFF";
        c.lineWidth = 1.5;
        c.beginPath();
        c.roundRect(-30, -18, 60, 24, 8);
        c.fill();
        c.stroke();
        
        // Draw speech bubble tail pointing to head
        c.beginPath();
        c.moveTo(-6, 6);
        c.lineTo(0, 14);
        c.lineTo(6, 6);
        c.closePath();
        c.fill();
        c.stroke();
        
        c.fillStyle = "#1E1233";
        c.font = "12px 'Fredoka', sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.speechText, 0, -6);
        c.restore();
        c.save(); // restore state for final pop
      }

      c.restore();
    }
  }

  // Instantiate objects
  const children = [
    new Child("Leo", width * 0.25, "#FF7043", "helmet"),    // Sunset Orange T-shirt & helmet
    new Child("Mia", width * 0.5, "#7C4DFF", "pigtails"),   // Neon Violet T-shirt & pigtails
    new Child("Ollie", width * 0.75, "#00E5FF", "cap")      // Electric Cyan T-shirt & cap
  ];

  const targets = [
    new FloatingTarget("A", width * 0.2, height * 0.45, "#00E5FF"),
    new FloatingTarget("B", width * 0.4, height * 0.35, "#FDD835"),
    new FloatingTarget("C", width * 0.6, height * 0.4, "#FF7043"),
    new FloatingTarget("1", width * 0.8, height * 0.35, "#7C4DFF")
  ];

  const particles = [];

  // Drop bouncy ball on click
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    ball.x = clickX;
    ball.y = clickY;
    ball.vx = (Math.random() - 0.5) * 8;
    ball.vy = -4;
    ball.active = true;

    // Sparkles at drop point
    for (let i = 0; i < 8; i++) {
      particles.push(new BurstParticle(clickX, clickY, "#FFD700"));
    }

    // Children call out!
    const randomChild = children[Math.floor(Math.random() * children.length)];
    const callouts = ["Look, a ball!", "Pass it here!", "Bouncy ball! ⚽"];
    randomChild.say(callouts[Math.floor(Math.random() * callouts.length)]);
  });

  // Track hover to wave hands
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    children.forEach(child => {
      if (Math.abs(child.x - mouseX) < 45) {
        if (!child.isWaving) {
          child.isWaving = true;
          child.say(Math.random() < 0.5 ? "Hello! 👋" : "Hi there!");
        }
      } else {
        child.isWaving = false;
      }
    });
  });

  // Main Loop
  function loop() {
    // Clear and fill transparent/dark gradient
    ctx.clearRect(0, 0, width, height);

    // Draw Hill grass base
    ctx.save();
    const hillGradient = ctx.createLinearGradient(0, height - 40, 0, height);
    hillGradient.addColorStop(0, "#26A69A"); // Emerald Mint top
    hillGradient.addColorStop(1, "#1B7E74"); // dark green bottom
    ctx.fillStyle = hillGradient;
    
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 5) {
      ctx.lineTo(x, getHillY(x));
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw grass highlights / blades randomly
    ctx.strokeStyle = "#80CBC4";
    ctx.lineWidth = 2;
    for (let x = 30; x < width - 10; x += 110) {
      const hillY = getHillY(x);
      ctx.beginPath();
      ctx.moveTo(x, hillY);
      ctx.lineTo(x - 3, hillY - 8);
      ctx.moveTo(x + 5, hillY);
      ctx.lineTo(x + 8, hillY - 10);
      ctx.stroke();
    }
    ctx.restore();

    // Update & draw targets
    targets.forEach(target => {
      target.update();
      target.draw(ctx);
    });

    // Update & draw ball
    ball.update();
    ball.draw(ctx);

    // Update & draw children
    children.forEach(child => {
      child.update();

      // Collision with targets
      targets.forEach(target => {
        const headY = child.y + child.jumpY - 40; // head center height
        const dist = Math.hypot(target.x - child.x, target.y - headY);
        
        // If close, trigger collision!
        if (dist < 26) {
          // Burst particles
          for (let i = 0; i < 12; i++) {
            particles.push(new BurstParticle(target.x, target.y, target.color));
          }
          // Move target somewhere else
          target.x = 40 + Math.random() * (width - 80);
          target.baseY = height * 0.35 + Math.random() * (height * 0.15);
          target.floatAngle = Math.random() * Math.PI * 2;

          // Cute reactions
          child.say(Math.random() < 0.5 ? "Got it! ⭐" : "Hooray!");
        }
      });

      // Collision child head and ball
      if (ball.active) {
        const headY = child.y + child.jumpY - 40;
        const distToBall = Math.hypot(ball.x - child.x, ball.y - headY);
        
        if (distToBall < child.size + ball.radius + 4) {
          // Headbutt/Kick physics!
          ball.vy = -6.5 - Math.random() * 3.5;
          ball.vx = child.direction * (2 + Math.random() * 3) + (Math.random() - 0.5) * 2;
          
          // Spawn collision sparkles
          for (let i = 0; i < 8; i++) {
            particles.push(new BurstParticle(ball.x, ball.y, ball.color));
          }

          child.say(Math.random() < 0.5 ? "Kick! ⚽" : "BAM!");
        }
      }

      child.draw(ctx);
    });

    // Update & draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw(ctx);
      }
    }

    requestAnimationFrame(loop);
  }

  // Start loop
  loop();
}

