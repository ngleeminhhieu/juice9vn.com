const measure = (value) => {
  const probe = document.createElement("div");
  probe.style.cssText = `position: absolute; visibility: hidden; width: ${value}`;
  document.body.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
};

export default function FitSliderModule() {
  if (typeof window.Swiper !== "function") return;

  document.querySelectorAll(".fitSliderJS").forEach((slider) => {
    const section = slider.closest("section") || document;
    const { pv = "--fit-pv", gap = "--fit-gap", autoplay } = slider.dataset;

    const readSizes = () => {
      const gutter = measure("var(--page-gutter)");
      const space = measure(`var(${gap})`);
      const fit = parseFloat(getComputedStyle(slider).getPropertyValue(pv)) || 1;
      const width = slider.clientWidth;
      const slide = (width - gutter * 2 - space * (fit - 1)) / fit;
      return {
        slidesPerView: (width + space) / (slide + space),
        spaceBetween: space,
        slidesOffsetBefore: gutter,
        slidesOffsetAfter: gutter,
      };
    };

    const progress = section.querySelector(".fitProgressJS");
    const swiper = new window.Swiper(slider, {
      ...readSizes(),
      rewind: Boolean(autoplay),
      speed: 700,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        prevEl: section.querySelector(".fitPrevJS"),
        nextEl: section.querySelector(".fitNextJS"),
      },
      pagination: progress ? { el: progress, type: "progressbar" } : false,
      autoplay: autoplay
        ? { delay: Number(autoplay) || 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
        : false,
      a11y: { enabled: false },
    });

    let frame = 0;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        Object.assign(swiper.params, readSizes());
        swiper.update();
      });
    }, { passive: true });
  });
}
