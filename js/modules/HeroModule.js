const pad = (value) => String(value).padStart(2, "0");

export default function HeroModule() {
  const hero = document.querySelector(".heroJS");
  const slider = hero?.querySelector(".heroSliderJS");
  if (!slider || typeof window.Swiper !== "function") return;

  const total = slider.querySelectorAll(".swiper-slide").length;
  const fill = hero.querySelector(".heroProgressJS");
  const current = hero.querySelector(".heroCurrentJS");
  const totalLabel = hero.querySelector(".heroTotalJS");

  if (totalLabel) totalLabel.textContent = pad(total);

  const restartProgress = () => {
    if (!fill || total < 2) return;
    fill.classList.remove("is-running");
    void fill.offsetWidth;
    fill.classList.add("is-running");
  };

  const swiper = new window.Swiper(slider, {
    slidesPerView: 1,
    speed: 900,
    loop: total > 1,
    effect: "fade",
    fadeEffect: { crossFade: true },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      prevEl: hero.querySelector(".heroPrevJS"),
      nextEl: hero.querySelector(".heroNextJS"),
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "上一张",
      nextSlideMessage: "下一张",
      firstSlideMessage: "这是第一张",
      lastSlideMessage: "这是最后一张",
    },
    on: {
      slideChange(instance) {
        if (current) current.textContent = pad(instance.realIndex + 1);
        restartProgress();
      },
    },
  });

  fill?.addEventListener("animationend", () => swiper.slideNext());
  restartProgress();
}
