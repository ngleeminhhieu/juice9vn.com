const SVG_NS = "http://www.w3.org/2000/svg";
const START_AT = 0.85;
const END_AT = 0.55;
const EASE = 0.14;

const clamp = (value) => Math.min(1, Math.max(0, value));

const createPath = (className) => {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", className);
  return path;
};

const buildPath = (points, bounds, cols) => {
  const marks = [];
  let length = 0;
  let last = points[0];
  let d = "";

  const lineTo = (to) => {
    d += ` L ${to.x} ${to.y}`;
    length += Math.abs(to.x - last.x) + Math.abs(to.y - last.y);
    last = to;
  };

  const first = points[0];
  last = cols > 1 ? { x: bounds.left, y: first.y } : first;
  d = `M ${last.x} ${last.y}`;
  lineTo(first);
  marks.push(length);

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    if (cols > 1 && Math.abs(from.y - to.y) > 2) {
      const edge = from.x > bounds.mid ? bounds.turnRight : bounds.turnLeft;
      lineTo({ x: edge, y: from.y });
      lineTo({ x: edge, y: to.y });
    } else if (Math.abs(from.x - to.x) > 2 && Math.abs(from.y - to.y) > 2) {
      lineTo({ x: from.x, y: to.y });
    }
    lineTo(to);
    marks.push(length);
  }

  if (cols > 1 && points.length > 1) {
    const end = points[points.length - 1];
    const before = points[points.length - 2];
    const leftward = Math.abs(end.y - before.y) <= 2 ? end.x < before.x : end.x > bounds.mid;
    lineTo({ x: leftward ? bounds.left : bounds.right, y: end.y });
  }

  return { d: d.trim(), marks, length };
};

function setup(root) {
  const list = root.querySelector(".milestonesListJS");
  const steps = list ? [...list.querySelectorAll(":scope > .milestone")] : [];
  const dots = steps.map((step) => step.querySelector(".milestone__dot"));
  if (!steps.length || dots.some((dot) => !dot)) return;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "milestones__svg");
  svg.setAttribute("aria-hidden", "true");
  const track = createPath("milestones__track");
  const line = createPath("milestones__line");
  svg.append(track, line);
  list.prepend(svg);
  root.classList.add("is-ready");

  let marks = [];
  let total = 0;
  let firstY = 0;
  let lastY = 0;
  let current = 0;
  let target = 0;
  let frame = 0;
  let nearby = false;

  const paint = () => {
    line.style.strokeDashoffset = String(total * (1 - current));
    const head = current * total + 0.5;
    steps.forEach((step, index) => step.classList.toggle("is-on", head >= marks[index]));
  };

  const measure = () => {
    const box = list.getBoundingClientRect();
    const span = Math.max(1, (START_AT - END_AT) * window.innerHeight + (lastY - firstY));
    target = clamp((START_AT * window.innerHeight - (box.top + firstY)) / span);
  };

  const tick = () => {
    frame = 0;
    measure();
    const gap = target - current;
    current = Math.abs(gap) < 0.0005 ? target : current + gap * EASE;
    paint();
    if (current !== target) frame = window.requestAnimationFrame(tick);
  };

  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };

  const layout = () => {
    const cols = Math.max(1, parseInt(getComputedStyle(list).getPropertyValue("--path-cols"), 10) || 1);
    steps.forEach((step, index) => {
      const row = Math.floor(index / cols);
      const pos = index % cols;
      step.style.setProperty("--col", String(row % 2 ? cols - pos : pos + 1));
      step.style.setProperty("--row", String(row + 1));
    });

    const box = list.getBoundingClientRect();
    const points = dots.map((dot) => {
      const rect = dot.getBoundingClientRect();
      return { x: Math.round(rect.left + rect.width / 2 - box.left), y: Math.round(rect.top + rect.height / 2 - box.top) };
    });

    const bounds = {
      left: -box.left,
      right: document.documentElement.clientWidth - box.left,
      mid: box.width / 2,
      turnLeft: 0,
      turnRight: box.width,
    };
    const path = buildPath(points, bounds, cols);
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    track.setAttribute("d", path.d);
    line.setAttribute("d", path.d);
    line.style.strokeDasharray = `${path.length} ${path.length}`;
    marks = path.marks;
    total = path.length;
    firstY = points[0].y;
    lastY = points[points.length - 1].y;
    measure();
    paint();
    request();
  };

  let resizeFrame = 0;
  const relayout = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(layout);
  };

  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(list);
  window.addEventListener("resize", relayout);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      request();
    }, { rootMargin: "25% 0px" }).observe(root);
  } else {
    nearby = true;
  }

  window.addEventListener("scroll", () => {
    if (nearby) request();
  }, { passive: true });

  layout();
}

export default function MilestonePathModule() {
  document.querySelectorAll(".milestonesJS").forEach(setup);
}
