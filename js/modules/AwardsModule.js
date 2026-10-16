const TITLE_ID = "award-dialog-title";

export default function AwardsModule() {
  const dialog = document.querySelector(".awardDialogJS");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const details = [...dialog.querySelectorAll(".award-detail")];
  const indexLabel = dialog.querySelector(".awardIndexJS");
  let current = 0;
  let lastOpener = null;
  let restoreFocus = true;

  const show = (index) => {
    current = (index + details.length) % details.length;
    details.forEach((detail, i) => {
      detail.hidden = i !== current;
      detail.querySelector(".award-detail__award")?.removeAttribute("id");
    });
    const heading = details[current].querySelector(".award-detail__award");
    if (heading) {
      heading.id = TITLE_ID;
      dialog.setAttribute("aria-labelledby", TITLE_ID);
      dialog.removeAttribute("aria-label");
    }
    if (indexLabel) indexLabel.textContent = String(current + 1);
    const info = details[current].querySelector(".award-detail__info");
    if (info) info.scrollTop = 0;
  };

  document.querySelectorAll(".awardOpenJS").forEach((opener) => {
    opener.addEventListener("click", () => {
      lastOpener = opener;
      restoreFocus = true;
      show(Number(opener.dataset.award) || 0);
      dialog.showModal();
    });
  });

  dialog.querySelector(".awardPrevJS")?.addEventListener("click", () => show(current - 1));
  dialog.querySelector(".awardNextJS")?.addEventListener("click", () => show(current + 1));
  dialog.querySelector(".awardCloseJS")?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  dialog.querySelectorAll(".awardLeadJS").forEach((link) => {
    link.addEventListener("click", () => {
      restoreFocus = false;
      dialog.close();
    });
  });

  dialog.addEventListener("close", () => {
    if (restoreFocus) lastOpener?.focus({ preventScroll: true });
  });
}
