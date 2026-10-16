export default function CapabilitiesModule() {
  document.querySelectorAll(".capabilitiesJS").forEach((section) => {
    const slider = section.querySelector(".capSliderJS");
    const tablist = section.querySelector(".capTabsJS");
    if (!slider || !tablist || typeof window.Swiper !== "function") return;

    const tabs = [...tablist.querySelectorAll('[role="tab"]')];

    const selectTab = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      const tab = tabs[index];
      if (!tab) return;
      if (focus) tab.focus({ preventScroll: true });
      if (tablist.scrollWidth > tablist.clientWidth) {
        tablist.scrollTo({ left: tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
      }
    };

    const swiper = new window.Swiper(slider, {
      slidesPerView: 1,
      speed: 700,
      effect: "fade",
      fadeEffect: { crossFade: true },
      rewind: true,
      preloadImages: false,
      lazy: { loadPrevNext: true },
      a11y: false,
      navigation: {
        prevEl: section.querySelector(".capPrevJS"),
        nextEl: section.querySelector(".capNextJS"),
      },
      on: {
        slideChange(instance) {
          selectTab(instance.activeIndex);
        },
      },
    });

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => swiper.slideTo(index));
    });

    tablist.addEventListener("keydown", (event) => {
      const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
      const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      const next = (keys[event.key] + tabs.length) % tabs.length;
      swiper.slideTo(next);
      selectTab(next, true);
    });
  });
}
