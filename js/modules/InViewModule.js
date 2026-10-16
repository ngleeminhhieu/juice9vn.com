const SHOW_RATIO = 0.3;

export default function InViewModule() {
  const items = [...document.querySelectorAll(".inViewJS")];
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-inview"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= SHOW_RATIO) {
        entry.target.classList.add("is-inview");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-inview");
      }
    });
  }, { threshold: [0, SHOW_RATIO] });

  items.forEach((item) => {
    item.classList.add("is-observed");
    observer.observe(item);
  });
}
