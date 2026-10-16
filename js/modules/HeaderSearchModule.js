const FIELDS = ["q", "size", "packaging", "category"];

export default function HeaderSearchModule() {
  const params = new URLSearchParams(window.location.search);

  document.querySelectorAll('form[role="search"]').forEach((form) => {
    FIELDS.forEach((name) => {
      const value = params.get(name)?.trim();
      const field = form.elements[name];
      if (value && field) field.value = value;
    });
  });

  document.querySelectorAll(".searchQueryJS").forEach((el) => {
    el.textContent = params.get("q")?.trim() || el.textContent;
  });

  const header = document.querySelector(".siteHeaderJS");
  const form = header?.querySelector(".headerSearchJS");
  const toggles = [...document.querySelectorAll(".searchToggleJS")];
  if (!header || !form || !toggles.length) return;

  const input = form.querySelector('input[type="search"]');
  let lastToggle = null;

  const isOpen = () => header.classList.contains("is-searching");

  const setOpen = (open, opener = null) => {
    if (open === isOpen()) return;
    header.classList.toggle("is-searching", open);
    form.hidden = !open;

    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭搜索" : "打开搜索");
    });

    if (open) {
      lastToggle = opener;
      header.classList.remove("is-hidden");
      input?.focus({ preventScroll: true });
      return;
    }

    if (form.contains(document.activeElement) && lastToggle?.checkVisibility?.()) {
      lastToggle.focus({ preventScroll: true });
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => setOpen(!isOpen(), toggle));
  });

  form.querySelector(".searchCloseJS")?.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) setOpen(false);
  });

  document.querySelectorAll(".menuOpenJS").forEach((opener) => {
    opener.addEventListener("click", () => setOpen(false));
  });
}
