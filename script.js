(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = [
    ...document.querySelectorAll("main section:not(.hero) > *"),
    ...document.querySelectorAll(".case > *")
  ];
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const progress = document.querySelector(".scroll-progress span");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];

  const updateProgress = () => {
    const root = document.documentElement;
    const range = root.scrollHeight - window.innerHeight;
    const percent = range > 0 ? (window.scrollY / range) * 100 : 0;
    progress.style.width = `${Math.min(100, percent)}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navLinks) {
          const active = link.hash === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    }, { rootMargin: "-40% 0px -45% 0px" });

    sections.forEach((section) => observer.observe(section));
  }
})();
