/* ==========================================
   KomuHana//M1yuN | SUBPAGE SCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Copyright year
  const year = document.getElementById("copyrightYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Fallback if a project screenshot is missing
  document.querySelectorAll(".project-image img").forEach((img) => {
    img.addEventListener("error", () => {
      img.remove();
    });
  });
});
