const initToc = () => {
  const toc = document.querySelector(".tocJS");
  const list = toc?.querySelector(".tocListJS");
  const content = document.querySelector(".postContentJS");
  if (!toc || !list || !content) return;

  const headings = [...content.querySelectorAll("h2, h3")];
  if (!headings.length) {
    toc.closest(".post-toc")?.remove();
    return;
  }

  const makeLink = (heading, isSub) => {
    const link = document.createElement("a");
    link.className = isSub ? "toc__link toc__link--sub" : "toc__link";
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    return link;
  };

  const groups = [];

  const setGroup = (target, open) => {
    target.item.classList.toggle("is-open", open);
    target.toggle.setAttribute("aria-expanded", String(open));
    target.wrap.inert = !open;
  };

  const openOnly = (target) => {
    groups.forEach((entry) => setGroup(entry, entry === target));
  };

  const addSubList = (target) => {
    const wrap = document.createElement("div");
    wrap.className = "toc__sub-wrap";
    wrap.id = `toc-sub-${groups.length + 1}`;
    const sub = document.createElement("ol");
    sub.className = "toc__sub";
    wrap.append(sub);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toc__toggle";
    toggle.setAttribute("aria-controls", wrap.id);
    toggle.setAttribute("aria-label", `展开或收起“${target.link.textContent}”的小节`);
    target.row.append(toggle);
    target.item.append(wrap);

    Object.assign(target, { sub, wrap, toggle });
    groups.push(target);
    setGroup(target, false);
    toggle.addEventListener("click", () => {
      if (target.item.classList.contains("is-open")) setGroup(target, false);
      else openOnly(target);
    });
  };

  let group = null;

  const entries = headings.map((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
    const item = document.createElement("li");

    if (heading.tagName === "H2" || !group) {
      const link = makeLink(heading, false);
      const row = document.createElement("div");
      row.className = "toc__row";
      row.append(link);
      item.className = "toc__item";
      item.append(row);
      list.append(item);
      group = { item, row, link, sub: null };
      return { heading, link, group: null };
    }

    if (!group.sub) addSubList(group);
    const link = makeLink(heading, true);
    item.append(link);
    group.sub.append(item);
    return { heading, link, group };
  });

  const desktop = window.matchMedia("(min-width: 1121px)");
  const syncOpen = () => {
    toc.open = desktop.matches;
  };
  syncOpen();
  desktop.addEventListener("change", syncOpen);

  list.addEventListener("click", (event) => {
    if (event.target.closest(".toc__link") && !desktop.matches) toc.open = false;
  });

  let active = null;
  const setActive = (entry) => {
    if (entry === active) return;
    active?.link.classList.remove("is-active");
    active?.link.removeAttribute("aria-current");
    active?.group?.link.classList.remove("is-parent");
    entry.link.classList.add("is-active");
    entry.link.setAttribute("aria-current", "location");
    entry.group?.link.classList.add("is-parent");
    const ownGroup = entry.group || groups.find((target) => target.link === entry.link) || null;
    openOnly(ownGroup);
    active = entry;
    if (toc.scrollHeight > toc.clientHeight && entry.link.offsetParent === toc) {
      toc.scrollTo({ top: entry.link.offsetTop - toc.clientHeight / 2, behavior: "smooth" });
    }
  };

  const spy = () => {
    const line = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 8;
    let current = entries[0];
    entries.forEach((entry) => {
      if (entry.heading.getBoundingClientRect().top <= line) current = entry;
    });
    setActive(current);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(spy, { rootMargin: "0px 0px -55% 0px" });
    headings.forEach((heading) => observer.observe(heading));
  }
  spy();
};

const initShare = () => {
  document.querySelectorAll(".shareJS").forEach((share) => {
    const pageUrl = window.location.href.split("#")[0];
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(document.querySelector("h1")?.textContent.trim() || document.title);
    const status = share.querySelector(".share__status");
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    };

    share.querySelectorAll("a[data-share]").forEach((link) => {
      if (targets[link.dataset.share]) link.href = targets[link.dataset.share];
    });

    const copy = share.querySelector("[data-share='copy']");
    let timer = 0;
    copy?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pageUrl);
        copy.classList.add("is-copied");
        if (status) status.textContent = "链接已复制";
      } catch {
        if (status) status.textContent = "复制失败，请手动复制地址栏链接";
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copy.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2400);
    });
  });
};

export default function PostModule() {
  initToc();
  initShare();
}
