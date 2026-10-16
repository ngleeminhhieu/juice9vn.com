const setLabel = (label, text) => {
  if (!label || !text) return;
  if (label.dataset.letterSwapReady) {
    label.dispatchEvent(new CustomEvent("letterswap:set", { detail: text }));
  } else {
    label.textContent = text;
  }
};

const initStory = () => {
  const body = document.querySelector(".storyBodyJS");
  const toggle = document.querySelector(".storyToggleJS");
  if (!body || !toggle) return;

  const label = toggle.querySelector(".letterSwapJS");
  const { more, less } = toggle.dataset;

  if (body.scrollHeight <= body.clientHeight + 1) {
    body.classList.add("is-expanded");
    toggle.closest(".product-story__toggle")?.setAttribute("hidden", "");
    return;
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    body.classList.toggle("is-expanded", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    setLabel(label, expanded ? less : more);

    if (!expanded) {
      const top = body.closest(".product-story__panel")?.getBoundingClientRect().top ?? 0;
      if (top < 0) window.scrollBy({ top: top - 120, behavior: "instant" });
    }
  });
};

const initStickyCta = () => {
  const cta = document.querySelector(".stickyCtaJS");
  const actions = document.querySelector(".productActionsJS");
  if (!cta || !actions || !("IntersectionObserver" in window)) return;

  const enquiry = document.getElementById("enquiry");
  let actionsAbove = false;
  let enquiryReached = false;

  const update = () => {
    const visible = actionsAbove && !enquiryReached;
    cta.classList.toggle("is-visible", visible);
    cta.inert = !visible;
  };

  new IntersectionObserver(([entry]) => {
    actionsAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(actions);

  if (enquiry) {
    new IntersectionObserver(([entry]) => {
      enquiryReached = entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    }).observe(enquiry);
  }

  update();
};

export default function ProductDetailModule() {
  initStory();
  initStickyCta();
}
