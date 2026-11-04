/* =========================================
   M1yuN Create. | MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     LOADING SCREEN
  ===================================== */

  const loader = document.getElementById("loader");

  const hideLoader = () => {
    if (loader) {
      loader.classList.add("loaded");
      document.body.classList.add("page-loaded");
    }
  };

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 1300);
  });

  // 読み込みが遅い場合の保険
  setTimeout(hideLoader, 5000);


  /* =====================================
     HEADER SCROLL
  ===================================== */

  const header = document.getElementById("header");

  const handleHeader = () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeader, {
    passive: true
  });

  handleHeader();


  /* =====================================
     MOBILE MENU
  ===================================== */

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-menu-inner > a");

  const openMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.add("active");
    mobileMenu.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "メニューを閉じる");

    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");

    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {
      if (mobileMenu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }


  /* =====================================
     SCROLL REVEAL
  ===================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });

  }


  /* =====================================
     BACK TO TOP
  ===================================== */

  const backTop = document.getElementById("backTop");

  if (backTop) {
    backTop.addEventListener("click", event => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =====================================
     CURRENT YEAR
  ===================================== */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =====================================
     IMAGE PLACEHOLDER / WORK CARD
  ===================================== */

  const workCards = document.querySelectorAll(".work-card");

  workCards.forEach(card => {

    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });

  });


  /* =====================================
     ANCHOR SMOOTH SCROLL
  ===================================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });


  console.log("M1yuN Create. | Website initialized.");

});
