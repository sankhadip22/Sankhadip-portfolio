/* ==========================================================================
   INTERACTIVE SCRIPTING - SANKHADIP MAITY'S PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. CANVAS PARTICLE BACKGROUND (Interactive Mouse-Tracking Node-Web)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    
    // Mouse interaction coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Distance of interaction
    };

    // Listen to mouse moving
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    // Listen to mouse leaving window
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Mobile touch interaction event tracking (pulls particle nodes to finger touch coordinates)
    window.addEventListener('touchmove', (event) => {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    }, { passive: true });

    // Clear coordinates when touch ends
    window.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    }, { passive: true });

    // Set canvas sizes
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', () => {
      setCanvasSize();
      initParticles();
    });

    // Node class structure
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      // Draw individual node
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      // Update coordinates
      update() {
        if (window.cyberMode === 'vortex') {
          // 1. Vortex Spiral Physics Mode
          let targetX = mouse.x !== null ? mouse.x : canvas.width / 2;
          let targetY = mouse.y !== null ? mouse.y : canvas.height / 2;
          let dx = targetX - this.x;
          let dy = targetY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            let angle = Math.atan2(dy, dx);
            let swirlSpeed = Math.min(3, 120 / distance); // swirl faster near center
            // Orbiting force + minor pulling force towards mouse
            this.x += Math.cos(angle + Math.PI / 2) * swirlSpeed + dx * 0.012;
            this.y += Math.sin(angle + Math.PI / 2) * swirlSpeed + dy * 0.012;
          } else {
            // Re-spawn far away if too close to mouse vortex center
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
          }
        } else if (window.cyberMode === 'gravity') {
          // 2. Cosmic Gravity Mode
          this.directionY += 0.18; // Pull down
          this.x += this.directionX;
          this.y += this.directionY;
          
          // Bounce off floor
          if (this.y + this.size >= canvas.height) {
            this.y = canvas.height - this.size;
            this.directionY = -this.directionY * 0.82; // Bounce elasticity
          }
          // Bounce off side boundaries
          if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
          }
        } else {
          // 3. Normal Standard Float Mode
          if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
          }

          // Mouse gravity pull connection
          if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
              ctx.beginPath();
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' 
                ? `rgba(2, 132, 199, ${0.1 * (1 - distance / mouse.radius)})`
                : `rgba(0, 242, 254, ${0.12 * (1 - distance / mouse.radius)})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              this.x += dx * 0.015;
              this.y += dy * 0.015;
            }
          }

          this.x += this.directionX;
          this.y += this.directionY;
        }
        
        this.draw();
      }
    }

    // Initialize particle array
    function initParticles() {
      particlesArray = [];
      // Calculate dense coordinates based on screens size
      let numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
      numberOfParticles = Math.min(numberOfParticles, 120); // Cap for performance
      numberOfParticles = Math.max(numberOfParticles, 30);  // Floor

      // Base node color depends on dark/light setting
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const nodeColor = isLight ? 'rgba(124, 58, 237, 0.25)' : 'rgba(0, 242, 254, 0.25)';

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - size * 2)) + size * 2;
        let y = (Math.random() * ((innerHeight - size * 2) - size * 2)) + size * 2;
        let directionX = (Math.random() * 0.6) - 0.3;
        let directionY = (Math.random() * 0.6) - 0.3;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, nodeColor));
      }
    }

    // Connect nodes close to each other
    function connectNodes() {
      let opacityValue = 1;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const maxDistance = 140;

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            
            // Neon teal or deep violet lines
            ctx.strokeStyle = isLight 
              ? `rgba(124, 58, 237, ${opacityValue * 0.12})`
              : `rgba(0, 242, 254, ${opacityValue * 0.12})`;
              
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animateParticles() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectNodes();
      animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Export variables so theme changer can trigger reinitialize
    window.initParticlesBackground = initParticles;
  }


  /* ------------------------------------------------------------------------
     2. DYNAMIC ROTATING TYPEWRITER EFFECT
     ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = ["Creative Engineer", "Software Developer", "Data Specialist", "Workflow Strategist"];
    let roleIndex = 0;
    let charIndex = roles[roleIndex].length;
    let isDeleting = true;
    let typeSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        // Remove characters
        typewriterElement.textContent = currentRole.substring(0, charIndex);
        charIndex--;
        typeSpeed = 40; // Deletes faster
      } else {
        // Add characters
        typewriterElement.textContent = currentRole.substring(0, charIndex);
        charIndex++;
        typeSpeed = 120; // Types slightly slower
      }

      // Check endpoints
      if (!isDeleting && charIndex === currentRole.length + 1) {
        // Pause at completion
        isDeleting = true;
        typeSpeed = 2200; // Stay static
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Brief pause before starting next
      }

      setTimeout(type, typeSpeed);
    }
    
    // Start typewriter slightly after load
    setTimeout(type, 1000);
  }


  /* ------------------------------------------------------------------------
     3. DARK / LIGHT THEME TOGGLE SYSTEM (Dynamic State Saving)
     ------------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Load theme from localStorage or fallback to preferred-scheme
  const savedTheme = localStorage.getItem('sankhadip-theme') || 'dark'; // Dark default
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sankhadip-theme', newTheme);
      
      updateThemeIcons(newTheme);
      
      // Update background particle nodes color immediately
      if (typeof window.initParticlesBackground === 'function') {
        window.initParticlesBackground();
      }
    });
  }

  function updateThemeIcons(theme) {
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }


  /* ------------------------------------------------------------------------
     4. HEADER SCROLL EFFECT & INTERSECTION ACTIVE SECTIONS
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Triggers if section takes up 40% height of screen view
      if (pageYOffset >= (sectionTop - sectionHeight * 0.35)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  /* ------------------------------------------------------------------------
     5. INTERSECTION OBSERVER FOR FADE-IN REVEALS (Mobile-Optimized Threshold)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        // Remove class when scrolled out of view to re-trigger animations repeatedly
        entry.target.classList.remove('revealed');
      }
    });
  }, {
    threshold: 0.05, // Trigger when at least 5% of the element is visible
    rootMargin: '0px 0px -15px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ------------------------------------------------------------------------
     6. INTERACTIVE COPY-TO-CLIPBOARD WITH MICRO-FEEDBACK
     ------------------------------------------------------------------------ */
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Micro-feedback UI switch: change icon to green success checkmark
        const originalSVG = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px; height:18px;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        btn.style.borderColor = '#10b981';

        // Revert feedback after delay
        setTimeout(() => {
          btn.innerHTML = originalSVG;
          btn.style.borderColor = '';
        }, 2200);
      }).catch(err => {
        console.error('Clipboard copy failed: ', err);
      });
    });
  });


  /* ------------------------------------------------------------------------
     7. SECURE MESSAGING FORM HANDLER (Interactive feedback loader)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Loading State transition
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Securing Connection...';
      submitBtn.disabled = true;

      // Extract form input data
      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      // Submit data to Web3Forms API
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let resData = await response.json();
        if (response.status === 200) {
          // Success state response
          submitBtn.textContent = 'Message Transmitted Successfully!';
          submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          submitBtn.style.color = '#fff';
          
          formStatus.textContent = 'Thank you! Your message has been encrypted and sent. I will get back to you shortly.';
          formStatus.className = 'form-status-msg success';
          formStatus.style.display = 'block';
          
          contactForm.reset();
        } else {
          // Server error feedback
          console.error(resData);
          formStatus.textContent = resData.message || 'Error occurred while transmitting. Please try again.';
          formStatus.className = 'form-status-msg';
          formStatus.style.color = '#ef4444';
          formStatus.style.display = 'block';
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.textContent = 'Network offline. Connection failed.';
        formStatus.className = 'form-status-msg';
        formStatus.style.color = '#ef4444';
        formStatus.style.display = 'block';
      })
      .finally(() => {
        // Fade back to normal form state after duration
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          formStatus.style.display = 'none';
        }, 6000);
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. MOBILE MENU DRAWER SYSTEM (Interactive Toggle and Close-on-click)
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinksList = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      
      // Select SVG lines inside toggle hamburger
      const lineMid = mobileToggle.querySelector('.line-mid');
      const lineTop = mobileToggle.querySelector('.line-top');
      const lineBot = mobileToggle.querySelector('.line-bot');
      
      if (navMenu.classList.contains('open')) {
        // Transition hamburger lines into a sleek glass 'X' close symbol
        if (lineMid) lineMid.style.opacity = '0';
        if (lineTop) {
          lineTop.style.transform = 'translateY(6px) rotate(45deg)';
          lineTop.style.transformOrigin = 'center';
        }
        if (lineBot) {
          lineBot.style.transform = 'translateY(-6px) rotate(-45deg)';
          lineBot.style.transformOrigin = 'center';
        }
      } else {
        // Transition back to hamburger menu
        if (lineMid) lineMid.style.opacity = '1';
        if (lineTop) lineTop.style.transform = 'none';
        if (lineBot) lineBot.style.transform = 'none';
      }
    });

    // Automatically close the overlay drawer when a menu item is tapped
    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        
        const lineMid = mobileToggle.querySelector('.line-mid');
        const lineTop = mobileToggle.querySelector('.line-top');
        const lineBot = mobileToggle.querySelector('.line-bot');
        if (lineMid) lineMid.style.opacity = '1';
        if (lineTop) lineTop.style.transform = 'none';
        if (lineBot) lineBot.style.transform = 'none';
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. MOBILE DEVICE DETECTION & BODY CLASS SCHEMAS
     ------------------------------------------------------------------------ */
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobileDevice) {
    document.body.classList.add('is-phone');
  }


  /* ------------------------------------------------------------------------
     10. HIGH-END CYBER PRELOADER LOGIC & SYNTHESIZED SOUND SYSTEM
     ------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------
     10. HIGH-END CYBER PRELOADER LOGIC & SYNTHESIZED SOUND SYSTEM (Automatic load)
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderLog = document.getElementById('preloader-log');

  if (preloader) {
    let audioCtx = null;
    let mainGain = null;
    let humOsc1 = null;
    let humOsc2 = null;

    function initAudioSynth() {
      if (audioCtx) return; // Prevent double initialization

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        
        mainGain = audioCtx.createGain();
        mainGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
        mainGain.connect(audioCtx.destination);
        
        mainGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.5);

        // Low System Hum filter
        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(140, audioCtx.currentTime);
        lowpass.connect(mainGain);

        // Deep drone oscillator 1 (Triangle wave at 55Hz - G1 note)
        humOsc1 = audioCtx.createOscillator();
        humOsc1.type = "triangle";
        humOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);
        
        // Second drone oscillator 2 (Sawtooth wave at 110Hz - G2 note)
        humOsc2 = audioCtx.createOscillator();
        humOsc2.type = "sawtooth";
        humOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);

        const humGain1 = audioCtx.createGain();
        humGain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
        
        const humGain2 = audioCtx.createGain();
        humGain2.gain.setValueAtTime(0.04, audioCtx.currentTime);

        humOsc1.connect(humGain1).connect(lowpass);
        humOsc2.connect(humGain2).connect(lowpass);

        humOsc1.start();
        humOsc2.start();
      } catch (e) {
        console.warn("Audio Synthesis failed to initialize: ", e);
      }
    }

    // High tech scanning sound trigger (Oscillator sine pitch sweeps)
    function playChirp(frequency) {
      if (!audioCtx) return;
      
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency * 1.5, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, audioCtx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain).connect(mainGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      } catch (e) {}
    }

    // Access granted sweep arpeggio
    function playSuccessChime() {
      if (!audioCtx) return;
      
      try {
        const now = audioCtx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 - E4 - G4 - C5 - E5 - G5
        
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          
          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          
          osc.connect(gain).connect(mainGain);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
      } catch (e) {}
    }

    function stopAllAudio() {
      if (mainGain && audioCtx) {
        try {
          mainGain.gain.setValueAtTime(mainGain.gain.value, audioCtx.currentTime);
          mainGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
          setTimeout(() => {
            if (humOsc1) humOsc1.stop();
            if (humOsc2) humOsc2.stop();
            if (audioCtx) audioCtx.close();
          }, 600);
        } catch (e) {}
      }
    }

    // Auto-initialize audio synthesizer on load
    initAudioSynth();

    // Loading HUD Status Sequence
    const logs = [
      "ACQUIRING INTERFACE DATA...",
      "ESTABLISHING SECURITY SHIELD...",
      "LOADING SYSTEM CORE MODULES...",
      "PARSING STYLESHEET ARRAYS...",
      "COMPILING PARTICLE DYNAMICS...",
      "INTERFACE STATUS: SECURED"
    ];

    let progress = 0;
    let logIndex = 0;

    function updatePreloader() {
      // Slower, organic loading simulation to give user time to interact and hear the sounds
      const increment = Math.floor(Math.random() * 2) + 1;
      progress = Math.min(progress + increment, 100);

      if (preloaderPercent) preloaderPercent.textContent = `${progress}%`;
      if (preloaderBar) preloaderBar.style.width = `${progress}%`;

      // Play scanner beeps, pitching upwards slightly as loading completes
      playChirp(350 + (progress * 6.5));

      // Cycle logs based on progress thresholds
      const currentLogIndex = Math.floor((progress / 100) * (logs.length - 1));
      if (currentLogIndex !== logIndex && preloaderLog) {
        logIndex = currentLogIndex;
        preloaderLog.textContent = logs[logIndex];
      }

      if (progress < 100) {
        setTimeout(updatePreloader, Math.random() * 40 + 35);
      } else {
        // Complete! Play satisfying success access chord chime
        playSuccessChime();

        // Brief delay for premium feel, then slide up preloader screen and stop background hum
        setTimeout(() => {
          preloader.classList.add('fade-out');
          stopAllAudio();
          
          // Re-initialize particles backdrops once screen is clear for perfect fluidity
          if (typeof window.initParticlesBackground === 'function') {
            window.initParticlesBackground();
          }
        }, 800);
      }
    }

    // Start loading percentage ticker automatically after 200ms
    setTimeout(updatePreloader, 200);
  }

  /* ------------------------------------------------------------------------
     11. RETRO CYBER DECK TERMINAL SYSTEM & SOUND SYNTHESIS ENGINE
     ------------------------------------------------------------------------ */
  let cyberAudioCtx = null;
  let cyberMainGain = null;

  function initCyberAudio() {
    if (cyberAudioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      cyberAudioCtx = new AudioContextClass();
      cyberMainGain = cyberAudioCtx.createGain();
      cyberMainGain.gain.setValueAtTime(0.35, cyberAudioCtx.currentTime);
      cyberMainGain.connect(cyberAudioCtx.destination);
    } catch (e) {
      console.warn("Cyber Audio context failed: ", e);
    }
  }

  function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 0.15; // 150ms buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // synthesized power up sound (CRT system hum initialization sweep)
  function playPowerUp() {
    initCyberAudio();
    if (!cyberAudioCtx) return;
    if (cyberAudioCtx.state === 'suspended') {
      cyberAudioCtx.resume();
    }
    
    const now = cyberAudioCtx.currentTime;
    const osc1 = cyberAudioCtx.createOscillator();
    const osc2 = cyberAudioCtx.createOscillator();
    const oscGain = cyberAudioCtx.createGain();
    
    osc1.type = "sawtooth";
    osc2.type = "triangle";
    
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(780, now + 0.45);
    
    osc2.frequency.setValueAtTime(160, now);
    osc2.frequency.exponentialRampToValueAtTime(1560, now + 0.45);
    
    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(cyberMainGain);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  // synthesized system exit frequency down-sweep
  function playExit() {
    if (!cyberAudioCtx) return;
    const now = cyberAudioCtx.currentTime;
    const osc = cyberAudioCtx.createOscillator();
    const oscGain = cyberAudioCtx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.32);
    
    oscGain.gain.setValueAtTime(0.15, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(oscGain).connect(cyberMainGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // synthesized keyboard key tick
  function playClick() {
    if (!cyberAudioCtx) return;
    const now = cyberAudioCtx.currentTime;
    const osc = cyberAudioCtx.createOscillator();
    const oscGain = cyberAudioCtx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.025);
    
    oscGain.gain.setValueAtTime(0.04, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.connect(oscGain).connect(cyberMainGain);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // synthesized bandpass white noise burst for static glitches
  function playGlitch() {
    initCyberAudio();
    if (!cyberAudioCtx) return;
    const now = cyberAudioCtx.currentTime;
    
    const buffer = createNoiseBuffer(cyberAudioCtx);
    const noiseNode = cyberAudioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = cyberAudioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(2.5, now);
    
    const noiseGain = cyberAudioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    
    noiseNode.connect(filter).connect(noiseGain).connect(cyberMainGain);
    
    const osc = cyberAudioCtx.createOscillator();
    const oscGain = cyberAudioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(25, now + 0.22);
    
    oscGain.gain.setValueAtTime(0.09, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc.connect(oscGain).connect(cyberMainGain);
    
    noiseNode.start(now);
    osc.start(now);
    
    noiseNode.stop(now + 0.18);
    osc.stop(now + 0.23);
  }

  // Elements
  const logoLink = document.querySelector('.logo-link');
  const cyberDeck = document.getElementById('cyber-deck');
  const deckClose = document.getElementById('deck-close');
  const deckInput = document.getElementById('deck-input-field');
  const deckOutput = document.getElementById('deck-output');
  const matrixCanvas = document.getElementById('matrix-canvas');
  let matrixInterval = null;

  const contactCardHtml = `
<p class="term-cyan">=========================================</p>
<p class="term-green">✦ SANKHADIP MAITY'S DIGITAL CARD ✦</p>
<p class="term-cyan">=========================================</p>
<p class="term-muted">STATUS:    <span class="term-green">✦ ACTIVE</span></p>
<p class="term-muted">ROLE:      Creative Engineer & Dev</p>
<p class="term-muted">LOCATION:  Kolkata, West Bengal</p>
<p class="term-cyan">-----------------------------------------</p>
<p class="term-muted">PHONE:     <a href="tel:+917318681400" target="_blank">+91 7318681400</a></p>
<p class="term-muted">EMAIL:     <a href="mailto:sankhadipmaity.in@gmail.com" target="_blank">sankhadipmaity.in@gmail.com</a></p>
<p class="term-muted">LINKEDIN:  <a href="https://www.linkedin.com/in/sankhadip22/" target="_blank">linkedin.com/in/sankhadip22</a></p>
<p class="term-muted">GITHUB:    <a href="https://github.com/sankhadip22" target="_blank">github.com/sankhadip22</a></p>
<p class="term-cyan">=========================================</p>
<p class="term-green">Type "help" to explore interactive core modules.</p>
<p>&nbsp;</p>
  `;

  // Start Matrix rain screen filter loop
  function startMatrixRain() {
    if (matrixInterval) return;
    matrixCanvas.style.display = 'block';
    const mCtx = matrixCanvas.getContext('2d');
    
    function resizeMatrixCanvas() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
    resizeMatrixCanvas();
    window.addEventListener('resize', resizeMatrixCanvas);
    
    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");
    
    const fontSize = 16;
    const columns = Math.floor(matrixCanvas.width / fontSize) + 1;
    const rainDrops = [];
    
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100;
    }
    
    function drawRain() {
      mCtx.fillStyle = 'rgba(3, 3, 8, 0.05)';
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      
      mCtx.fillStyle = '#0F0';
      mCtx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        mCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        
        if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    }
    
    matrixInterval = setInterval(drawRain, 30);
  }

  function stopMatrixRain() {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
      matrixCanvas.style.display = 'none';
    }
  }

  // Intercept nav logo clicks and touch gestures
  if (logoLink && cyberDeck) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Synthesize power sweep
      playPowerUp();
      
      // Force body CRT shake
      document.body.classList.add('crt-glitch');
      setTimeout(() => {
        document.body.classList.remove('crt-glitch');
      }, 450);
      
      // Fade in terminal UI
      cyberDeck.style.display = 'flex';
      cyberDeck.style.opacity = '0';
      cyberDeck.offsetHeight; // force paint reflow
      cyberDeck.style.opacity = '1';
      
      // Autofocus input prompt
      setTimeout(() => {
        deckInput.focus();
      }, 150);
      
      // Load startup screen logs and print digital contact card automatically
      deckOutput.innerHTML = `
        <p class="term-green">✦ SANKHADIP.OS [Version 1.8.2] SECURE SHELL ACTIVE ✦</p>
        <p class="term-muted">Type "help" for a list of quantum commands or "exit" to close.</p>
        <p>&nbsp;</p>
      ` + contactCardHtml;
      
      deckOutput.scrollTop = deckOutput.scrollHeight;
    });
  }

  function closeCyberDeck() {
    if (cyberDeck) {
      playExit();
      cyberDeck.style.opacity = '0';
      setTimeout(() => {
        cyberDeck.style.display = 'none';
      }, 400);
    }
  }

  if (deckClose) {
    deckClose.addEventListener('click', closeCyberDeck);
  }

  // Command prompt text listener
  if (deckInput) {
    deckInput.addEventListener('input', () => {
      playClick(); // metallic tick sound on typing
    });
    
    deckInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = deckInput.value.trim().toLowerCase();
        deckInput.value = '';
        
        // Print command echo to output log
        const pEcho = document.createElement('p');
        pEcho.innerHTML = `<span class="term-prompt">sankhadip@core:~$</span> ${cmd}`;
        deckOutput.appendChild(pEcho);
        
        executeCommand(cmd);
        
        deckOutput.scrollTop = deckOutput.scrollHeight;
      }
    });
  }

  function executeCommand(cmd) {
    const args = cmd.split(' ');
    const primaryCmd = args[0];
    const pResponse = document.createElement('p');
    
    switch (primaryCmd) {
      case 'help':
        pResponse.innerHTML = `
<span class="term-green">Available Quantum Commands:</span><br>
  - <span class="term-cyan">help</span>: Displays list of modules.<br>
  - <span class="term-cyan">contact</span>: Print contact information card.<br>
  - <span class="term-cyan">matrix</span>: Toggles green cascading digital rain screen filter.<br>
  - <span class="term-cyan">vortex</span>: Orbit background particle stars around cursor.<br>
  - <span class="term-cyan">gravity</span>: Apply downward cosmic pull to particle stars.<br>
  - <span class="term-cyan">float</span> / <span class="term-cyan">normal</span>: Restore default floating particle dynamics.<br>
  - <span class="term-cyan">glitch</span>: Trigger retro CRT monitor frequency noise glitch.<br>
  - <span class="term-cyan">light</span> / <span class="term-cyan">dark</span>: Change theme appearance mode.<br>
  - <span class="term-cyan">clear</span>: Clear terminal console screen logs.<br>
  - <span class="term-cyan">exit</span>: Gracefully exit shell overlay.
        `;
        break;
      case 'contact':
        pResponse.innerHTML = contactCardHtml;
        break;
      case 'matrix':
        if (matrixInterval) {
          stopMatrixRain();
          pResponse.innerHTML = `<span class="term-muted">Matrix digital rain loop:</span> <span class="term-error">DISABLED</span>`;
        } else {
          startMatrixRain();
          pResponse.innerHTML = `<span class="term-muted">Matrix digital rain loop:</span> <span class="term-green">ENABLED</span>`;
        }
        break;
      case 'vortex':
        window.cyberMode = 'vortex';
        pResponse.innerHTML = `<span class="term-muted">Background dynamic:</span> <span class="term-cyan">VORTEX SPIRAL ACTIVE</span>`;
        break;
      case 'gravity':
        window.cyberMode = 'gravity';
        pResponse.innerHTML = `<span class="term-muted">Background dynamic:</span> <span class="term-cyan">COSMIC GRAVITY DRIFT ACTIVE</span>`;
        break;
      case 'float':
      case 'normal':
        window.cyberMode = 'float';
        pResponse.innerHTML = `<span class="term-muted">Background dynamic:</span> <span class="term-green">DEFAULT FLOAT RESTORED</span>`;
        break;
      case 'glitch':
        playGlitch();
        document.body.classList.add('crt-glitch');
        setTimeout(() => {
          document.body.classList.remove('crt-glitch');
        }, 450);
        pResponse.innerHTML = `<span class="term-error">WARNING: SYSTEM STATIC SHIELD BREACHED... SHIELD RESTORED.</span>`;
        break;
      case 'light':
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('sankhadip-theme', 'light');
        if (typeof window.initParticlesBackground === 'function') {
          window.initParticlesBackground();
        }
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');
        if (sun && moon) { sun.style.display = 'none'; moon.style.display = 'block'; }
        pResponse.innerHTML = `<span class="term-muted">Appearance mode:</span> <span class="term-green">LIGHT SPECTRUM ACTIVE</span>`;
        break;
      case 'dark':
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('sankhadip-theme', 'dark');
        if (typeof window.initParticlesBackground === 'function') {
          window.initParticlesBackground();
        }
        const sIcon = document.getElementById('sun-icon');
        const mIcon = document.getElementById('moon-icon');
        if (sIcon && mIcon) { sIcon.style.display = 'block'; mIcon.style.display = 'none'; }
        pResponse.innerHTML = `<span class="term-muted">Appearance mode:</span> <span class="term-green">DARK SPECTRUM ACTIVE</span>`;
        break;
      case 'clear':
        deckOutput.innerHTML = `
          <p class="term-green">✦ SANKHADIP.OS [Version 1.8.2] SECURE SHELL ACTIVE ✦</p>
          <p class="term-muted">Type "help" for a list of quantum commands or "exit" to close.</p>
          <p>&nbsp;</p>
        `;
        return;
      case 'exit':
        closeCyberDeck();
        return;
      case '':
        return;
      default:
        pResponse.innerHTML = `<span class="term-error">Command not found: "${primaryCmd}". Type "help" for instructions.</span>`;
    }
    deckOutput.appendChild(pResponse);
  }

});
