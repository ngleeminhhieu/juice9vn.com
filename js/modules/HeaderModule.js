export default function HeaderModule() {
  const header = document.querySelector(".siteHeaderJS");
  if (!header) return;

  const STUCK_AFTER = 4;
  const HIDE_AFTER = 200;
  const THRESHOLD = 6;
  const dropdowns = [...header.querySelectorAll(".nav-dropdown")];
  let lastY = Math.max(window.scrollY, 0);
  let frame = 0;

  const isPinned = () => header.classList.contains("is-searching")
    || Boolean(header.querySelector(".nav-dropdown.is-open, :focus-visible"));

  const update = () => {
    frame = 0;
    const y = Math.max(window.scrollY, 0);
    header.classList.toggle("is-stuck", y > STUCK_AFTER);

    if (y <= HIDE_AFTER || isPinned()) {
      header.classList.remove("is-hidden");
      lastY = y;
      return;
    }

    const delta = y - lastY;
    if (Math.abs(delta) < THRESHOLD) return;
    header.classList.toggle("is-hidden", delta > 0);
    lastY = y;
  };

  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("pageshow", requestUpdate);
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  update();

  const buttonOf = (dropdown) => dropdown.querySelector(":scope > button");

  const sync = (dropdown) => {
    const expanded = dropdown.classList.contains("is-open") || dropdown.matches(":hover");
    buttonOf(dropdown)?.setAttribute("aria-expanded", String(expanded));
  };

  const setOpen = (dropdown, open) => {
    dropdown.classList.toggle("is-open", open);
    sync(dropdown);
  };

  const closeOthers = (current) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== current) setOpen(dropdown, false);
    });
  };

  dropdowns.forEach((dropdown) => {
    const button = buttonOf(dropdown);

    dropdown.addEventListener("mouseenter", () => {
      closeOthers(dropdown);
      sync(dropdown);
    });

    dropdown.addEventListener("mouseleave", () => setOpen(dropdown, false));

    button?.addEventListener("click", () => {
      closeOthers(dropdown);
      setOpen(dropdown, !dropdown.classList.contains("is-open"));
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
    });

    dropdown.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !dropdown.classList.contains("is-open")) return;
      setOpen(dropdown, false);
      button?.focus();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-dropdown")) return;
    dropdowns.forEach((dropdown) => setOpen(dropdown, false));
  });
}
