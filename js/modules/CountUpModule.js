const DEFAULT_DURATION = 1400;
const SHOW_RATIO = 0.35;

export default function CountUpModule() {
  const counters = [...document.querySelectorAll("[data-count]")];
  if (!counters.length) return;

  const getParts = (counter) => {
    const stat = counter.closest(".stat");
    return {
      unit: stat?.querySelector(".stat__unit") || counter.parentElement?.querySelector(".stat__unit"),
      label: stat?.querySelector(".stat__label"),
    };
  };

  const hidePart = (element) => {
    if (!element) return;
    element.style.opacity = "0";
    element.style.transform = "translateY(0.35em)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 1.1, 0.4, 1)";
  };

  const showPart = (element) => {
    if (!element) return;
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  };

  const state = new Map();

  const reset = (counter) => {
    const current = state.get(counter);
    if (current) {
      window.cancelAnimationFrame(current.frame);
      window.clearTimeout(current.timer);
    }
    state.set(counter, { running: false, frame: 0, timer: 0 });
    const { unit, label } = getParts(counter);
    counter.textContent = "0";
    hidePart(unit);
    hidePart(label);
  };

  const animate = (counter) => {
    const current = state.get(counter);
    if (current?.running) return;

    const target = Number(counter.dataset.count) || 0;
    const duration = Number(counter.dataset.countDur) || DEFAULT_DURATION;
    const { unit, label } = getParts(counter);
    const start = performance.now();
    const run = { running: true, frame: 0, timer: 0 };
    state.set(counter, run);

    const tick = () => {
      const progress = Math.min(Math.max((performance.now() - start) / duration, 0), 1);
      counter.textContent = String(Math.round(target * (1 - ((1 - progress) ** 3))));

      if (progress < 1) {
        run.frame = window.requestAnimationFrame(tick);
        return;
      }

      showPart(label);
      run.timer = window.setTimeout(() => showPart(unit), 150);
    };

    run.frame = window.requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      const { unit, label } = getParts(counter);
      counter.textContent = counter.dataset.count;
      showPart(unit);
      showPart(label);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= SHOW_RATIO) {
        animate(entry.target);
      } else if (!entry.isIntersecting) {
        reset(entry.target);
      }
    });
  }, { threshold: [0, SHOW_RATIO] });

  counters.forEach((counter) => {
    reset(counter);
    observer.observe(counter);
  });
}
