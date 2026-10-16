const columnCount = (table) =>
  [...table.rows].reduce(
    (max, row) => Math.max(max, [...row.cells].reduce((sum, cell) => sum + (cell.colSpan || 1), 0)),
    0,
  );

export default function ContentTableModule() {
  const wraps = [];

  document.querySelectorAll(".content-detail table").forEach((table) => {
    let wrap = table.closest(".content-detail__table");
    if (wrap && wrap.firstElementChild !== table) return;

    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "content-detail__table";
      table.before(wrap);
      wrap.append(table);
    }

    wrap.style.setProperty("--content-table-cols", String(columnCount(table) || 1));
    wraps.push(wrap);
  });

  if (!wraps.length) return;

  const sync = () => {
    wraps.forEach((wrap) => {
      const scrollable = wrap.scrollWidth - wrap.clientWidth > 1;
      wrap.classList.toggle("is-scrollable", scrollable);

      if (scrollable) {
        wrap.setAttribute("tabindex", "0");
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", "可横向滚动的表格");
      } else {
        wrap.removeAttribute("tabindex");
        wrap.removeAttribute("role");
        wrap.removeAttribute("aria-label");
      }
    });
  };

  let frame = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(sync);
  }, { passive: true });

  sync();
  document.fonts?.ready.then(sync);
}
