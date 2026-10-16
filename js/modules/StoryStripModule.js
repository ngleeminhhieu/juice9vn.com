const SHOW_RATIO = 0.3;

export default function StoryStripModule() {
  const strips = [...document.querySelectorAll(".storyStripJS")];
  if (!strips.length) return;

  const desktop = window.matchMedia("(min-width: 1121px)");

  strips.forEach((strip) => {
    let swiper = null;

    const measure = (value) => {
      const probe = document.createElement("div");
      probe.style.cssText = `position: absolute; visibility: hidden; width: ${value}`;
      document.body.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    };

    const readSizes = () => ({
      perView: parseFloat(getComputedStyle(strip).getPropertyValue("--story-pv")) || 2.2,
      gap: measure("var(--story-gap)"),
      gutter: measure("var(--page-gutter)"),
    });

    const applySizes = () => {
      if (!swiper) return;
      const { perView, gap, gutter } = readSizes();
      Object.assign(swiper.params, {
        slidesPerView: perView,
        spaceBetween: gap,
        slidesOffsetBefore: gutter,
        slidesOffsetAfter: gutter,
      });
      swiper.update();
    };

    const mount = () => {
      if (desktop.matches) {
        swiper?.destroy(true, true);
        swiper = null;
        return;
      }
      if (swiper || typeof window.Swiper !== "function") return;
      const { perView, gap, gutter } = readSizes();
      swiper = new window.Swiper(strip, {
        slidesPerView: perView,
        spaceBetween: gap,
        slidesOffsetBefore: gutter,
        slidesOffsetAfter: gutter,
        speed: 600,
        grabCursor: true,
        watchOverflow: true,
        a11y: { enabled: false },
      });
    };

    let frame = 0;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(applySizes);
    }, { passive: true });

    desktop.addEventListener("change", mount);
    mount();

    if (!("IntersectionObserver" in window)) {
      strip.classList.add("is-staggered");
      return;
    }

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= SHOW_RATIO) {
          strip.classList.add("is-staggered");
        } else if (!entry.isIntersecting) {
          strip.classList.remove("is-staggered");
        }
      });
    }, { threshold: [0, SHOW_RATIO] }).observe(strip);
  });
}
