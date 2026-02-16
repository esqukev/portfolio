import { gsap } from "gsap";

export function horizontalLoop(
  items: HTMLElement[],
  config: {
    paused?: boolean;
    draggable?: boolean;
    center?: boolean | Element;
    centerOffset?: number;
    repeat?: number;
    speed?: number;
    snap?: boolean | number;
    paddingRight?: string;
    reversed?: boolean;
    onChange?: (element: HTMLElement, index: number) => void;
  }
) {
  items = gsap.utils.toArray(items);
  config = config || {};
  const onChange = config.onChange;
  let lastIndex = 0;
  const tl = gsap.timeline({
    repeat: config.repeat,
    onUpdate: onChange
      ? function () {
          const i = tl.closestIndex();
          if (lastIndex !== i) {
            lastIndex = i;
            onChange!(items[i], i);
          }
        }
      : undefined,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const spaceBefore: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(typeof config.snap === "number" ? config.snap : 1);
  const container = config.center === true ? items[0].parentNode as HTMLElement : (Array.isArray(config.center) ? config.center[0] : config.center) || (items[0].parentNode as HTMLElement);
  let totalWidth: number;
  const getTotalWidth = () =>
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    spaceBefore[0] +
    items[length - 1].offsetWidth * (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (parseFloat(config.paddingRight || "0") || 0);
  const pixelsPerSecond = (config.speed || 1) * 100;

  const populateWidths = () => {
    let b1 = container.getBoundingClientRect();
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
      xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px") as string) / widths[i]) * 100 + (gsap.getProperty(el, "xPercent") as number));
      const b2 = el.getBoundingClientRect();
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    });
    gsap.set(items, { xPercent: (i: number) => xPercents[i] });
    totalWidth = getTotalWidth();
  };

  let timeOffset = 0;
  let timeWrap: (t: number) => number;

  const populateOffsets = () => {
    const pxOffset = config.centerOffset ?? 0;
    timeOffset = config.center ? (tl.duration() * (container.offsetWidth / 2 + pxOffset)) / totalWidth : 0;
    if (config.center) {
      times.forEach((t, i) => {
        times[i] = timeWrap(tl.labels["label" + i] + (tl.duration() * widths[i]) / 2 / totalWidth - timeOffset);
      });
    }
  };

  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length;
    let closest = 1e10;
    let index = 0;
    while (i--) {
      let d = Math.abs(values[i] - value);
      if (d > wrap / 2) d = wrap - d;
      if (d < closest) {
        closest = d;
        index = i;
      }
    }
    return index;
  };

  const populateTimeline = () => {
    tl.clear();
    for (let i = 0; i < length; i++) {
      const item = items[i];
      const curX = (xPercents[i] / 100) * widths[i];
      const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
      const distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);
      tl.to(
        item,
        { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond },
        0
      )
        .fromTo(
          item,
          { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
          { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    timeWrap = gsap.utils.wrap(0, tl.duration());
  };

  const refresh = (deep?: boolean) => {
    const progress = tl.progress();
    tl.progress(0, true);
    populateWidths();
    if (deep) populateTimeline();
    populateOffsets();
    if (deep && (tl as gsap.core.Timeline & { draggable?: unknown }).draggable) {
      tl.time(times[curIndex], true);
    } else {
      tl.progress(progress, true);
    }
  };

  const onResize = () => refresh(true);
  window.addEventListener("resize", onResize);
  let proxy: HTMLDivElement;

  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();

  function toIndex(index: number, vars?: gsap.TweenVars) {
    vars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) index += index > curIndex ? -length : length;
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex && index !== curIndex) time += tl.duration() * (index > curIndex ? 1 : -1);
    if (time < 0 || time > tl.duration()) (vars as Record<string, unknown>).modifiers = { time: timeWrap };
    curIndex = newIndex;
    (vars as Record<string, unknown>).overwrite = true;
    gsap.killTweensOf(proxy);
    return (vars as Record<string, unknown>).duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
  }

  tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
  tl.closestIndex = (setCurrent?: boolean) => {
    const index = getClosest(times, tl.time(), tl.duration());
    if (setCurrent) {
      curIndex = index;
    }
    return index;
  };
  tl.current = () => curIndex;
  tl.next = (vars?: gsap.TweenVars) => toIndex(tl.current() + 1, vars);
  tl.previous = (vars?: gsap.TweenVars) => toIndex(tl.current() - 1, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    tl.vars?.onReverseComplete?.();
    tl.reverse();
  }

  const DraggableLib = typeof window !== "undefined" ? (window as Window & { Draggable?: { create: (el: HTMLElement, config: unknown) => unknown[] } }).Draggable : undefined;
  if (config.draggable && DraggableLib) {
    proxy = document.createElement("div");
    const wrap = gsap.utils.wrap(0, 1);
    let ratio: number, startProgress: number, lastSnap: number, initChangeX: number;
    const syncIndex = () => tl.closestIndex(true);
    const instance = DraggableLib!.create(proxy, {
      trigger: items[0].parentNode as HTMLElement,
      type: "x",
      onPressInit(this: { x: number }) {
        const x = this.x;
        gsap.killTweensOf(tl);
        tl.pause();
        startProgress = tl.progress();
        refresh();
        ratio = 1 / totalWidth;
        initChangeX = startProgress / -ratio - x;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDrag(this: { startX: number; x: number }) {
        tl.progress(wrap(startProgress + (this.startX - this.x) * ratio));
      },
      onThrowUpdate(this: { startX: number; x: number }) {
        tl.progress(wrap(startProgress + (this.startX - this.x) * ratio));
      },
      overshootTolerance: 0,
      inertia: true,
      snap(this: { x: number }, value: number) {
        if (Math.abs(startProgress / -ratio - this.x) < 10) return lastSnap + initChangeX;
        const time = -(value * ratio) * tl.duration();
        const wrappedTime = timeWrap(time);
        const snapTime = times[getClosest(times, wrappedTime, tl.duration())];
        let dif = snapTime - wrappedTime;
        if (Math.abs(dif) > tl.duration() / 2) dif += dif < 0 ? tl.duration() : -tl.duration();
        lastSnap = (time + dif) / tl.duration() / -ratio;
        return lastSnap;
      },
      onRelease: syncIndex,
      onThrowComplete: syncIndex,
    })[0];
    (tl as gsap.core.Timeline & { draggable?: unknown }).draggable = instance;
  }

  tl.closestIndex(true);
  lastIndex = curIndex;
  if (onChange) onChange(items[curIndex], curIndex);

  return tl;
}
