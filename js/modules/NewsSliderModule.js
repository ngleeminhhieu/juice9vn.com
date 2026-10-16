export default function NewsSliderModule() {
  document.querySelectorAll(".newsJS").forEach((section) => {
    const slider = section.querySelector(".newsSliderJS");
    if (!slider || typeof window.Swiper !== "function") return;

    new window.Swiper(slider, {
      slidesPerView: 1.15,
      spaceBetween: 12,
      speed: 600,
      watchOverflow: true,
      navigation: {
        prevEl: section.querySelector(".newsPrevJS"),
        nextEl: section.querySelector(".newsNextJS"),
      },
      breakpoints: {
        681: { slidesPerView: 2, spaceBetween: 24 },
        1121: { slidesPerView: 3, spaceBetween: 32 },
      },
      a11y: {
        prevSlideMessage: "上一组新闻",
        nextSlideMessage: "下一组新闻",
      },
    });
  });
}
