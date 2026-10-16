export default function RelatedSliderModule() {
  document.querySelectorAll(".relatedJS").forEach((section) => {
    const slider = section.querySelector(".relatedSliderJS");
    if (!slider || typeof window.Swiper !== "function") return;

    new window.Swiper(slider, {
      slidesPerView: 2.2,
      spaceBetween: 10,
      speed: 600,
      watchOverflow: true,
      navigation: {
        prevEl: section.querySelector(".relatedPrevJS"),
        nextEl: section.querySelector(".relatedNextJS"),
      },
      breakpoints: {
        681: { slidesPerView: 4, spaceBetween: 10 },
        1121: { slidesPerView: 5, spaceBetween: 14 },
        1600: { slidesPerView: 5, spaceBetween: 16 },
      },
      a11y: {
        prevSlideMessage: "上一组产品",
        nextSlideMessage: "下一组产品",
      },
    });
  });
}
