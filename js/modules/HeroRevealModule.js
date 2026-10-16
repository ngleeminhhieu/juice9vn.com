const DURATION = 700;
const KEYS_DOWN = new Set(["ArrowDown", "PageDown", " "]);
const KEYS_UP = new Set(["ArrowUp", "PageUp"]);

const cubicBezier = (x1, y1, x2, y2) => {
  const a = (p1, p2) => 1 - 3 * p2 + 3 * p1;
  const b = (p1, p2) => 3 * p2 - 6 * p1;
  const c = (p1) => 3 * p1;
  const at = (t, p1, p2) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t, p1, p2) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t = Math.min(Math.max(t - (at(t, x1, x2) - x) / s, 0), 1);
    }
    return at(t, y1, y2);
  };
};

const ease = cubicBezier(.5, 0, .2, 1);

export default function HeroRevealModule() {
  const hero = document.querySelector(".slideCoverJS");
  const content = hero?.nextElementSibling;
  if (!hero || !content) return;

  const desktop = window.matchMedia("(min-width: 1121px)");
  let animating = false;

  const contentTop = () => Math.round(content.getBoundingClientRect().top + window.scrollY);

  const scrollToY = (target) => {
    const start = window.scrollY;
    const distance = target - start;
    if (!distance) return;
    const startedAt = performance.now();
    animating = true;

    const step = (now) => {
      const progress = Math.min((now - startedAt) / DURATION, 1);
      window.scrollTo({ top: start + distance * ease(progress), behavior: "instant" });
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        animating = false;
      }
    };

    window.requestAnimationFrame(step);
  };

  const blocked = (target) => !desktop.matches || Boolean(target?.closest?.("dialog[open], select, textarea"));

  const handle = (event, down, delta) => {
    if (blocked(event.target)) return;

    if (animating) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const y = window.scrollY;
    const top = contentTop();
    const reveal = down && y < top - 1;
    const restore = !down && y > 0 && y + delta <= top;
    if (!reveal && !restore) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    scrollToY(reveal ? top : 0);
  };

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || !event.deltaY) return;
    handle(event, event.deltaY > 0, event.deltaY);
  }, { capture: true, passive: false });

  window.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest?.("input, select, textarea, button, [contenteditable]")) return;
    const down = KEYS_DOWN.has(event.key) && !event.shiftKey;
    const up = KEYS_UP.has(event.key) || (event.key === " " && event.shiftKey);
    if (!down && !up) return;
    handle(event, down, event.key === "ArrowUp" ? -40 : -window.innerHeight);
  }, { capture: true });

  hero.querySelector(".heroExploreJS")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (desktop.matches) {
      scrollToY(contentTop());
    } else {
      content.scrollIntoView({ behavior: "smooth" });
    }
  });
}
