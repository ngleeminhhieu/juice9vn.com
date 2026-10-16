export default function CatalogModule() {
  const form = document.querySelector(".catalogToolsJS");
  if (!form) return;

  const drawers = [...form.querySelectorAll(".catalogDrawerJS")];
  const openers = [...document.querySelectorAll(".catalogDrawerOpenJS")];
  const badges = [...document.querySelectorAll(".catalogBadgeJS")];
  const searches = () => [...form.querySelectorAll("input[type='search']")];
  const closeTimers = new Map();

  const syncBadges = () => {
    badges.forEach((badge) => {
      const drawer = document.getElementById(badge.closest(".catalogDrawerOpenJS")?.getAttribute("aria-controls"));
      if (!drawer) return;
      const count = drawer.querySelectorAll("input[type='radio']:checked").length
        + [...drawer.querySelectorAll("input[type='search']")].filter((input) => input.value.trim()).length;
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  };

  const setExpanded = (drawer, expanded) => {
    openers
      .filter((opener) => opener.getAttribute("aria-controls") === drawer.id)
      .forEach((opener) => opener.setAttribute("aria-expanded", String(expanded)));
  };

  const finishClose = (drawer) => {
    window.clearTimeout(closeTimers.get(drawer));
    if (!drawer.classList.contains("is-closing")) return;
    drawer.classList.remove("is-closing");
    drawer.close();
  };

  const close = (drawer) => {
    if (!drawer.open || drawer.classList.contains("is-closing")) return;
    drawer.classList.add("is-closing");
    const duration = parseFloat(getComputedStyle(drawer).animationDuration) * 1000 || 0;
    closeTimers.set(drawer, window.setTimeout(() => finishClose(drawer), duration + 50));
  };

  const params = new URLSearchParams(window.location.search);
  form.querySelectorAll("input[type='radio']").forEach((input) => {
    input.checked = params.getAll(input.name).includes(input.value);
  });
  searches().forEach((input) => {
    input.value = params.get(input.name) || "";
  });

  openers.forEach((opener) => {
    opener.addEventListener("click", () => {
      const drawer = document.getElementById(opener.getAttribute("aria-controls"));
      if (!drawer || drawer.open || typeof drawer.showModal !== "function") return;
      drawer.classList.remove("is-closing");
      drawer.showModal();
      const body = drawer.querySelector(".catalog-drawer__body");
      if (body) body.scrollTop = 0;
      setExpanded(drawer, true);
    });
  });

  drawers.forEach((drawer) => {
    drawer.addEventListener("animationend", (event) => {
      if (event.target === drawer && !event.pseudoElement) finishClose(drawer);
    });

    drawer.addEventListener("cancel", (event) => {
      event.preventDefault();
      close(drawer);
    });

    drawer.addEventListener("close", () => setExpanded(drawer, false));

    drawer.addEventListener("click", (event) => {
      if (event.target === drawer || event.target.closest(".catalogDrawerCloseJS")) close(drawer);
    });

    drawer.querySelector(".catalogDrawerClearJS")?.addEventListener("click", () => {
      drawer.querySelectorAll("input[type='radio']").forEach((input) => {
        input.checked = false;
      });
      drawer.querySelectorAll("input[type='search']").forEach((input) => {
        input.value = "";
      });
      syncBadges();
    });

    drawer.querySelectorAll(".catalogMoreJS").forEach((button) => {
      const group = button.closest(".catalog-drawer__group");
      const label = button.querySelector(".letterSwapJS");
      const { more, less } = button.dataset;

      const toggle = (expanded) => {
        group.classList.toggle("is-expanded", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        const text = expanded ? less : more;
        if (label?.dataset.letterSwapReady) {
          label.dispatchEvent(new CustomEvent("letterswap:set", { detail: text }));
        } else if (label) {
          label.textContent = text;
        }
      };

      button.addEventListener("click", () => toggle(!group.classList.contains("is-expanded")));
      if (group.querySelector(".catalog-option.is-extra input:checked")) toggle(true);
    });
  });

  form.addEventListener("pointerdown", (event) => {
    const input = event.target.closest(".catalog-option")?.querySelector("input[type='radio']");
    if (input) input.dataset.wasChecked = String(input.checked);
  });

  form.addEventListener("click", (event) => {
    const input = event.target.closest(".catalog-option input[type='radio']");
    if (!input || event.target !== input) return;
    if (input.dataset.wasChecked === "true") input.checked = false;
    delete input.dataset.wasChecked;
    syncBadges();
  });

  form.addEventListener("change", syncBadges);
  form.addEventListener("input", syncBadges);

  form.addEventListener("submit", () => {
    searches().forEach((input) => {
      input.disabled = input.value.trim() === "";
    });
  });

  window.addEventListener("pageshow", () => {
    searches().forEach((input) => {
      input.disabled = false;
    });
  });

  const bar = document.querySelector(".catalogBarJS");
  const end = document.querySelector(".catalogEndJS");
  if (bar && end && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      bar.classList.toggle("is-away", entry.isIntersecting || entry.boundingClientRect.top < 0);
    }).observe(end);
  }

  syncBadges();
}
