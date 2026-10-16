export default function LoadMoreModule() {
  const mobile = window.matchMedia("(max-width: 680px)");

  document.querySelectorAll(".loadMoreListJS").forEach((list) => {
    const button = document.querySelector(`.loadMoreBtnJS[aria-controls="${list.id}"]`);
    const stepFor = () => Number((mobile.matches && list.dataset.loadMoreStepMobile) || list.dataset.loadMoreStep) || 10;
    let step = stepFor();
    let items = [];
    let visible = 0;

    const reset = () => {
      step = stepFor();
      items = [...list.children];
      visible = Math.min(step, items.length);
      items.forEach((item, index) => {
        item.hidden = index >= visible;
        item.classList.remove("is-revealed");
      });
      if (button) button.hidden = items.length <= visible;
    };

    list.addEventListener("loadmore:reset", reset);
    mobile.addEventListener("change", reset);
    reset();
    if (!button) return;

    button.addEventListener("click", () => {
      const next = items.slice(visible, visible + step);

      next.forEach((item, index) => {
        item.hidden = false;
        item.style.setProperty("--reveal-index", index);
        item.classList.add("is-revealed");
      });

      visible += next.length;
      button.hidden = visible >= items.length;

      if (button.hidden) next[0]?.querySelector("a, button")?.focus({ preventScroll: true });
    });
  });
}
