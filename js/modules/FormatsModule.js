const SHOT_OVERVIEW = "./assets/images/containers-overview.png";
const SHOT_CONTAINER = "./assets/images/container.png";

const LOAD_ROWS = [
  ["ft20", "20英尺", "6.06米", "2.44米", "2.59米"],
  ["ft40", "40英尺", "12.19米", "2.44米", "2.59米"],
  ["hc40", "40英尺高柜", "12.19米", "2.44米", "2.90米"],
];

const loadTable = (load) => {
  const rows = LOAD_ROWS
    .map(([key, name, length, width, height]) => `<tr><th scope="row">${name}</th><td>${length}</td><td>${width}</td><td>${height}</td><td>约 ${load[key]} ${load.unit}</td></tr>`)
    .join("");

  return `<div class="formats__load swiper-no-swiping">
      <table class="formats__load-table">
        <caption>集装箱装载量</caption>
        <thead><tr><th scope="col">集装箱</th><th scope="col">长</th><th scope="col">宽</th><th scope="col">高</th><th scope="col">装载量</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
};

export default function FormatsModule() {
  const root = document.querySelector(".formatsJS");
  if (!root || typeof window.Swiper !== "function") return;

  const source = root.querySelector(".formatsDataJS");
  const stage = root.querySelector(".formatsStageJS");
  const wrapper = stage?.querySelector(".swiper-wrapper");
  const thumbs = root.querySelector(".formatsThumbsJS");
  const sizes = root.querySelector(".formatsSizesJS");
  const materials = [...root.querySelectorAll("[data-material]")];
  if (!source || !wrapper || !thumbs || !sizes || !materials.length) return;

  let formats = [];
  try {
    formats = JSON.parse(source.textContent);
  } catch {
    return;
  }
  if (!formats.length) return;

  let material = materials.find((button) => button.classList.contains("is-active"))?.dataset.material ?? materials[0].dataset.material;
  let sizeIndex = 0;
  let shotIndex = 0;
  let slider = null;

  const inMaterial = () => formats.filter((format) => format.material === material);

  const shotsOf = (format) => {
    const shots = format.images.map((src, index) => ({ src, thumb: src, label: index ? `${format.name}装箱方式` : format.name }));
    if (!format.load) return shots;
    shots.push({ src: SHOT_OVERVIEW, thumb: SHOT_OVERVIEW, label: "集装箱规格" });
    shots.push({ load: format.load, thumb: SHOT_CONTAINER, label: "集装箱装载量" });
    return shots;
  };

  const syncThumbs = () => {
    [...thumbs.children].forEach((thumb, index) => {
      thumb.classList.toggle("is-active", index === shotIndex);
      thumb.setAttribute("aria-pressed", String(index === shotIndex));
    });
  };

  const buildSlider = (count) => {
    slider?.destroy(true, true);
    slider = new window.Swiper(stage, {
      speed: 500,
      slidesPerView: 1,
      initialSlide: shotIndex,
      grabCursor: count > 1,
      allowTouchMove: count > 1,
      navigation: {
        prevEl: root.querySelector(".formatsPrevJS"),
        nextEl: root.querySelector(".formatsNextJS"),
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "上一张",
        nextSlideMessage: "下一张",
      },
      on: {
        slideChange: (instance) => {
          shotIndex = instance.activeIndex;
          syncThumbs();
        },
      },
    });
  };

  const paintStage = () => {
    const format = inMaterial()[sizeIndex];
    if (!format) return;

    root.classList.toggle("is-custom", Boolean(format.custom));
    if (format.custom) {
      const shot = root.querySelector(".formatsCustomShotJS");
      if (shot && format.images[0]) shot.src = format.images[0];
      slider?.destroy(true, true);
      slider = null;
      wrapper.innerHTML = "";
      thumbs.innerHTML = "";
      return;
    }

    const shots = shotsOf(format);
    shotIndex = Math.min(shotIndex, shots.length - 1);

    wrapper.innerHTML = shots
      .map((shot) => `<div class="swiper-slide">${shot.load ? loadTable(shot.load) : `<img src="${shot.src}" alt="${shot.label}" decoding="async">`}</div>`)
      .join("");

    thumbs.innerHTML = shots
      .map((shot, index) => `<button class="formats-thumb${index === shotIndex ? " is-active" : ""}" type="button" data-shot="${index}" aria-pressed="${index === shotIndex}" aria-label="${shot.label}"><img src="${shot.thumb}" alt="" loading="lazy" decoding="async"></button>`)
      .join("");

    buildSlider(shots.length);
  };

  const paintSizes = () => {
    sizeIndex = 0;
    shotIndex = 0;

    sizes.innerHTML = inMaterial()
      .map((format, index) => `<button class="formats-cell${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-size="${index}"><img src="${format.images[0]}" alt="" loading="lazy" decoding="async"><span>${format.name}</span></button>`)
      .join("");

    paintStage();
  };

  materials.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.material === material) return;
      material = button.dataset.material;
      materials.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      paintSizes();
    });
  });

  sizes.addEventListener("click", (event) => {
    const cell = event.target.closest("[data-size]");
    if (!cell) return;
    sizeIndex = Number(cell.dataset.size);
    shotIndex = 0;
    [...sizes.children].forEach((item) => {
      const active = item === cell;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    paintStage();
  });

  thumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-shot]");
    if (!thumb) return;
    const index = Number(thumb.dataset.shot);
    if (slider) {
      slider.slideTo(index);
      return;
    }
    shotIndex = index;
    syncThumbs();
  });

  paintSizes();
}
