const SHOW_RATIO = 0.25;

export default function ExhibitionModule() {
  const maps = [...document.querySelectorAll(".exhibitionMapJS")];
  if (!maps.length) return;

  if (!("IntersectionObserver" in window)) {
    maps.forEach((map) => map.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const map = entry.target;
      if (entry.intersectionRatio >= SHOW_RATIO) {
        map.classList.remove("is-pending");
        map.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        map.classList.remove("is-visible");
        map.classList.add("is-pending");
      }
    });
  }, { threshold: [0, SHOW_RATIO] });

  maps.forEach((map) => {
    map.classList.add("is-pending");
    observer.observe(map);
  });
}
