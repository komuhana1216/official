
/* =========================================
   YOUR NAME | INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const revealItems = document.querySelectorAll(".reveal");
  const year = document.getElementById("year");
  const canvas = document.getElementById("particles");

  // CURRENT YEAR
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // LOADING SCREEN
  // Wait for the page to finish loading, then hide the overlay.
  const hideLoader = () => {
    if (!loader) return;

    loader.classList.add("is-hidden");

    // Remove it from keyboard navigation after the transition.
    window.setTimeout(() => {
      loader.setAttribute("aria-hidden", "true");
    }, 700);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 500);
  } else {
    window.addEventListener("load", () => {
      window.setTimeout(hideLoader, 350);
    }, { once: true });

    // Fallback in case a third-party resource loads slowly.
    window.setTimeout(hideLoader, 2500);
  }

  // MOBILE MENU
  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "メニューを開く" : "メニューを閉じる"
      );

      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) {
        closeMenu();
      }
    });
  }

  // SCROLL REVEAL
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // ACTIVE NAVIGATION
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const matches =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            if (matches) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // NEON PARTICLE BACKGROUND
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;
  let lastFrameTime = 0;
  let running = false;

  const pointer = {
    x: -1000,
    y: -1000
  };

  const isMobile = () => window.innerWidth <= 640;
  const isLowMotion = () => motionPreference.matches;

  const createParticles = () => {
    const area = width * height;
    const divisor = isMobile() ? 18000 : 12500;
    const count = Math.min(
      90,
      Math.max(20, Math.floor(area / divisor))
    );

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.15
    }));
  };

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
    drawFrame();
  };

  const drawFrame = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw particles.
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(0, 217, 255, ${particle.alpha})`;

      ctx.fill();
    });

    // Connect nearby particles with subtle neon lines.
    const maxDistance = isMobile() ? 75 : 105;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity =
            (1 - distance / maxDistance) * 0.13;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle =
            `rgba(0, 190, 255, ${opacity})`;

          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  const animate = (timestamp) => {
    if (!running) return;

    animationId = requestAnimationFrame(animate);

    // Limit the update rate to reduce unnecessary work.
    if (timestamp - lastFrameTime < 33) return;
    lastFrameTime = timestamp;

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Subtle mouse interaction.
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < 10000 && distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        const force = (100 - distance) / 1000;

        particle.x += (dx / distance) * force * 5;
        particle.y += (dy / distance) * force * 5;
      }

      // Wrap particles around the screen.
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    });

    drawFrame();
  };

  const startAnimation = () => {
    if (running || isLowMotion()) return;

    running = true;
    lastFrameTime = 0;
    animationId = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    running = false;

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });

  window.addEventListener("resize", resizeCanvas, {
    passive: true
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  motionPreference.addEventListener("change", () => {
    stopAnimation();

    if (isLowMotion()) {
      drawFrame();
    } else {
      startAnimation();
    }
  });

  resizeCanvas();
  startAnimation();
});
