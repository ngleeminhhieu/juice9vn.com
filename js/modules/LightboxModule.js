export default function LightboxModule() {
  if (!window.Fancybox?.bind || !document.querySelector("[data-fancybox]")) return;

  window.Fancybox.bind("[data-fancybox]", {
    dragToClose: true,
    placeFocusBack: true,
    Thumbs: false,
    l10n: {
      CLOSE: "关闭",
      NEXT: "下一张",
      PREV: "上一张",
      MODAL: "按 ESC 键关闭",
      ERROR: "加载失败，请稍后再试",
      IMAGE_ERROR: "图片加载失败",
      TOGGLE_ZOOM: "放大 / 缩小",
      TOGGLE_SLIDESHOW: "自动播放",
      TOGGLE_FULLSCREEN: "全屏",
      DOWNLOAD: "下载",
    },
  });
}
