const RULES = [
  { items: "section:not(.enquiry) .section-head > *, .news__head > *", type: "up", step: 120 },
  { items: ".release-grid > li", type: "up", step: 70 },
  { items: ".releases__more", type: "up" },
  { items: ".brand-intro__banner", type: "zoom-out", children: ".brand-intro__bg" },
  { items: ".brand-intro__line:first-child", type: "left" },
  { items: ".brand-intro__line:last-child", type: "right" },
  { items: ".intro-grid > *", type: "up", step: 120 },
  { items: ".stat", type: "up", step: 100 },
  { items: ".service-card:first-child", type: "left" },
  { items: ".service-card:last-child", type: "right" },
  { items: ".exhi-logos", type: "up" },
  { items: ".cert-logos li", type: "zoom", step: 50 },
  { items: ".why-card", type: "up", step: 100 },
  { items: ".cta-banner__content > *", type: "left", step: 100 },
  { items: ".cta-banner__can", type: "rise", step: 120 },
  { items: ".leader-grid > *", type: "up", step: 120 },
  { items: ".production__head > *", type: "up", step: 120 },
  { items: ".award-grid > li", type: "up", step: 80 },
  { items: ".activity-card", type: "up", step: 60 },
  { items: ".brand-row__body > *", type: "up", step: 100 },
  { items: ".news-slider", type: "right", children: ".news-card", step: 100 },
  { items: ".related-slider", type: "right", children: ".release-card", step: 100 },
  { items: ".product-story__panel", type: "up" },
  { items: ".blog-list__head > *", type: "up", step: 120 },
  { items: ".featured-lead", type: "up" },
  { items: ".featured-list > li", type: "right", step: 100 },
  { items: ".post-grid > li", type: "up", step: 80 },
  { items: ".post-side > *", type: "up", step: 120 },
  { items: ".contact-card", type: "up", step: 80 },
  { items: ".contact-map", type: "up" },
  { items: ".faq__aside > *", type: "up", step: 100 },
  { items: ".faq-item", type: "up", step: 60 },
  { items: ".service-step", type: "up", step: 100 },
  { items: ".formats__panel", type: "up" },
  { items: ".finish-card", type: "up", step: 100 },
];

const MAX_STEPS = 8;

export default function RevealModule() {
  if (!("IntersectionObserver" in window)) return;

  const owners = new Map();

  RULES.forEach((rule, index) => {
    document.querySelectorAll(rule.items).forEach((el) => {
      if (owners.has(el)) return;
      const targets = rule.children ? [...el.querySelectorAll(rule.children)] : [el];
      targets.forEach((target) => {
        target.dataset.reveal = rule.type;
      });
      owners.set(el, { group: index, step: rule.step || 0, targets });
    });
  });

  if (!owners.size) return;

  const setDelay = (target, ms) => target.style.setProperty("--reveal-delay", `${ms}ms`);

  const show = (el, order, fromBelow) => {
    const { step, targets } = owners.get(el);
    targets.forEach((target, i) => {
      if (fromBelow && target.classList.contains("is-above")) {
        target.style.transition = "none";
        target.classList.remove("is-above");
        void target.offsetWidth;
        target.style.transition = "";
      }
      const index = targets.length > 1 ? i : order;
      setDelay(target, Math.min(index, MAX_STEPS) * step);
      target.classList.remove("is-above");
      target.classList.add("is-inview");
    });
  };

  const hide = (el, above) => {
    owners.get(el).targets.forEach((target) => {
      setDelay(target, 0);
      target.classList.remove("is-inview");
      target.classList.toggle("is-above", above);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const entering = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left));

    const counters = new Map();
    entering.forEach((entry) => {
      const { group } = owners.get(entry.target);
      const order = counters.get(group) || 0;
      counters.set(group, order + 1);
      const viewport = entry.rootBounds?.height || window.innerHeight;
      show(entry.target, order, entry.boundingClientRect.top > viewport / 2);
    });

    entries.filter((entry) => !entry.isIntersecting).forEach((entry) => {
      hide(entry.target, entry.boundingClientRect.top < 0);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  const root = document.documentElement;
  root.classList.add("reveal-ready", "reveal-instant");
  owners.forEach((_, el) => observer.observe(el));
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => root.classList.remove("reveal-instant"));
  });
}
