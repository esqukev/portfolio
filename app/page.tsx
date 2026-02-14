"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const ROTATING_WORDS = ["Developer", "Designer", "Artist"];

const DRAW_SVG_VARIANTS = [
  `<path d="M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
  `<path d="M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
  `<path d="M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
  `<path d="M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
  `<path d="M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
];

function horizontalLoop(
  items: HTMLElement[],
  config: {
    paused?: boolean;
    draggable?: boolean;
    center?: boolean | Element;
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
    gsap.set(items, { xPercent: (i) => xPercents[i] });
    totalWidth = getTotalWidth();
  };

  let timeOffset = 0;
  let timeWrap: (t: number) => number;

  const populateOffsets = () => {
    timeOffset = config.center ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth : 0;
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

  if (config.draggable && typeof Draggable !== "undefined") {
    proxy = document.createElement("div");
    const wrap = gsap.utils.wrap(0, 1);
    let ratio: number, startProgress: number, lastSnap: number, initChangeX: number;
    const syncIndex = () => tl.closestIndex(true);
    const instance = Draggable.create(proxy, {
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

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const drawLineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const sliderListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    if (wordRef.current) {
      gsap.fromTo(
        wordRef.current,
        { y: -80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }, [wordIndex]);

  // Draw underline effect on hover (stroke-dashoffset, no paid plugin)
  useEffect(() => {
    const container = drawLineRef.current?.closest("[data-draw-line]");
    const box = drawLineRef.current;
    if (!container || !box) return;

    let nextIndex = 0;
    let enterTween: gsap.core.Tween | null = null;
    let leaveTween: gsap.core.Tween | null = null;

    const onEnter = () => {
      if (enterTween?.isActive()) return;
      leaveTween?.kill();

      const svgPath = DRAW_SVG_VARIANTS[nextIndex % DRAW_SVG_VARIANTS.length];
      box.innerHTML = `<svg width="310" height="40" viewBox="0 0 310 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${svgPath}</svg>`;
      const path = box.querySelector("path");
      if (!path) return;

      const len = (path as SVGPathElement).getTotalLength();
      path.setAttribute("stroke", "currentColor");
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      enterTween = gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => { enterTween = null; },
      });
      nextIndex++;
    };

    const onLeave = () => {
      const path = box.querySelector("path");
      if (!path) return;

      const playOut = () => {
        if (leaveTween?.isActive()) return;
        const len = (path as SVGPathElement).getTotalLength();
        leaveTween = gsap.to(path, {
          strokeDashoffset: len,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            leaveTween = null;
            box.innerHTML = "";
          },
        });
      };

      if (enterTween?.isActive()) {
        enterTween.eventCallback("onComplete", playOut);
      } else {
        playOut();
      }
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      enterTween?.kill();
      leaveTween?.kill();
    };
  }, []);

  // Projects slider (horizontal loop, prev/next + click)
  useEffect(() => {
    const list = sliderListRef.current;
    if (!list) return;

    const slides = gsap.utils.toArray<HTMLElement>("[data-slider-slide]");
    const nextBtn = document.querySelector("[data-slider-next]");
    const prevBtn = document.querySelector("[data-slider-prev]");
    const totalEl = document.querySelector("[data-slider-total]");
    const stepEl = document.querySelector("[data-slider-step]");
    const stepsParent = stepEl?.parentElement;

    let activeElement: HTMLElement | null = null;
    const totalSlides = slides.length;

    if (totalEl) totalEl.textContent = totalSlides < 10 ? `0${totalSlides}` : String(totalSlides);
    if (stepsParent && stepEl) {
      stepsParent.innerHTML = "";
      slides.forEach((_, i) => {
        const clone = stepEl.cloneNode(true) as HTMLElement;
        clone.textContent = i + 1 < 10 ? `0${i + 1}` : String(i + 1);
        stepsParent.appendChild(clone);
      });
    }
    const allSteps = stepsParent?.querySelectorAll("[data-slider-step]") ?? [];

    const mq = window.matchMedia("(min-width: 992px)");
    let useNextForActive = mq.matches;
    mq.addEventListener("change", (e) => {
      useNextForActive = e.matches;
      if (currentEl) applyActive(currentEl, currentIndex, false);
    });

    let currentEl: HTMLElement | null = null;
    let currentIndex = 0;

    const resolveActive = (el: HTMLElement) => (useNextForActive ? (el.nextElementSibling as HTMLElement) || slides[0] : el);

    const applyActive = (el: HTMLElement, index: number, animateNumbers = true) => {
      if (activeElement) activeElement.classList.remove("active");
      const target = resolveActive(el);
      target.classList.add("active");
      activeElement = target;
      if (allSteps.length && animateNumbers) {
        gsap.to(allSteps, { y: `${-100 * index}%`, ease: "power3", duration: 0.45 });
      } else if (allSteps.length) {
        gsap.set(allSteps, { y: `${-100 * index}%` });
      }
    };

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: false,
      center: true,
      onChange: (el, index) => {
        currentEl = el;
        currentIndex = index;
        applyActive(el, index, true);
        setActiveProjectIndex(index);
      },
    });

    const mapClickIndex = (i: number) => (useNextForActive ? i - 1 : i);
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        if (slide.classList.contains("active")) return;
        loop.toIndex(mapClickIndex(i), { ease: "power3", duration: 0.725 });
      });
    });

    nextBtn?.addEventListener("click", () => loop.next({ ease: "power3", duration: 0.725 }));
    prevBtn?.addEventListener("click", () => loop.previous({ ease: "power3", duration: 0.725 }));

    if (!currentEl && slides[0]) {
      currentEl = slides[0];
      currentIndex = 0;
      applyActive(currentEl, currentIndex, false);
    }

    return () => {
      nextBtn?.removeEventListener("click", () => {});
      prevBtn?.removeEventListener("click", () => {});
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Artist Press Kit",
      description: "Showcase your art with a fully functional-minimal design press kit to make you stand out and look professional.",
      technologies: ["Next.js", "JavaScript", "Vercel", "Reactive", "Tailwind CSS"],
      image: "/project-1.jpg",
      link: "https://www.killernugget.com/",
      github: "https://github.com/esqukev/KillerWeb2",
    },
    {
      id: 2,
      title: "Brand Presentation",
      description: "Immersive visual experiences — crafting tailored visuals that push the boundaries of your vision.",
      technologies: ["Next.js", "TypeScript", "CSS", "Tailwind", "React", "GSAP", "Lenis", "Open Graph"],
      image: "/project-2.jpg",
      link: "https://www.planb-fx.com/",
      github: "https://github.com/esqukev/planbfx-final-site",
    },
    {
      id: 3,
      title: "Auction",
      description: "A complete website for auctioning collection items focused on back end.",
      technologies: ["Html", "CSS", "Javascript", "API", "Postman", "JSON"],
      image: "/project-2.jpg",
      link: "",
      github: "https://github.com/esqukev/auction.git",
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "Beautiful weather application with location-based forecasts and interactive charts.",
      technologies: ["Vue.js", "Chart.js", "OpenWeather API", "CSS3"],
      image: "/project-3.jpg",
      link: "#",
      github: "#",
    },
    {
      id: 5,
      title: "Social Media Analytics",
      description: "Analytics dashboard for tracking social media performance with data visualization.",
      technologies: ["Next.js", "Python", "PostgreSQL", "D3.js", "TypeScript"],
      image: "/project-4.jpg",
      link: "#",
      github: "#",
    },
  ];

  const skills = [
    { name: "Next.js", level: 50 },
    { name: "JavaScript", level: 55 },
    { name: "Node.js", level: 40 },
    { name: "HTML/CSS", level: 95 },
    { name: "Tailwind CSS", level: 70 },
    { name: "MongoDB", level: 50 },
    { name: "SQL", level: 60 },
    { name: "Git", level: 65 },
  ];

  const handleSendEmail = () => {
    const email = "kevinbermudez46@gmail.com";
    const subject = "Contact from Portfolio";
    
    // Open Gmail compose directly - this works universally
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;
    window.open(gmailLink, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a] relative overflow-x-hidden">
      {/* Asterisk - right edge, fixed in first banner, hover effect */}
      <div
        className="asterisk-right fixed right-0 top-1/2 z-0 select-none"
        style={{
          fontFamily: "var(--font-leckerli-one), cursive",
          fontSize: "1200px",
          lineHeight: 1,
        }}
      >
        *
      </div>
      {/* Nav - sticky at top */}
      <div className="sticky top-0 z-50 pt-6 pb-2 px-4">
        <div className="w-[min(90%,42rem)] mx-auto transition-all duration-500 ease-out">
        <nav
          className="rounded-2xl border-none overflow-hidden transition-all duration-500 bg-[#000]"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex justify-center items-center h-14 px-6 gap-8">
            {["About", "Skills"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <a href="#home" className="flex-shrink-0 mx-2">
              <Image src="/apple-touch-icon.png" alt="KB" width={32} height={32} className="object-contain" />
            </a>
            {["Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
        {/* Animated strip - Apple style with fade edges */}
        <div className="relative mt-1 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, #e9d5ff 0%, #d8b4fe 50%, #e9d5ff 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#e9d5ff] to-transparent" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#e9d5ff] to-transparent" />
          </div>
          <div className="relative z-0 py-2.5 overflow-hidden">
            <div className="flex w-max animate-marquee-strip">
              <span className="marquee-text">EXPLORE • DESIGN • CREATE • IMAGINE • ELEVATE •</span>
              <span className="marquee-text">EXPLORE • DESIGN • CREATE • IMAGINE • ELEVATE •</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} id="home" className="pt-40 pb-32 px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.95] tracking-tight text-[#0a0a0a] animate-fade-in">
            Web{" "}
            <span ref={wordRef} className="inline-block overflow-visible">
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>
          <h2 className="mt-6 animate-slide-left">
            <span data-draw-line className="text-draw inline-block cursor-default">
              <span className="text-draw__span">Innovative Design</span>
              <div ref={drawLineRef} data-draw-line-box className="text-draw__box" />
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-xl md:text-2xl text-[#737373] leading-relaxed animate-slide-left delay-100">
            I create bold, modern web experiences that look insane and perform even better — full-stack development with cutting-edge tech.
          </p>
          <div className="mt-12 flex gap-4 animate-fade-in delay-400">
            <a
              href="#projects"
              className="inline-block px-6 py-3 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-[#262626] transition-all duration-300 ease-out"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-block px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-all duration-300 ease-out"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About - centered, large text, fade-in */}
      <section ref={aboutRef} id="about" className="pt-32 pb-24 px-6 lg:px-8 relative">
        {/* Rotating asterisk ring - behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[480px] h-[480px] flex items-center justify-center">
            <div className="absolute inset-0 animate-spin-slow">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (360 / 18) * i;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 text-8xl font-extrabold"
                    style={{
                      color: "rgb(216, 180, 254)",
                      transform: `rotate(${angle}deg) translateY(-220px) rotate(-${angle}deg)`,
                      fontFamily: "var(--font-leckerli-one), cursive",
                    }}
                  >
                    *
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#0a0a0a] leading-tight mb-5 animate-fade-in-slow">
            I&apos;m a passionate web developer with expertise in building modern, scalable web applications.
            I love turning complex problems into simple, beautiful, and intuitive solutions.
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#0a0a0a] leading-tight animate-fade-in-slow delay-200">
            With a strong foundation in front-end and back-end technologies, I enjoy creating
            full-stack applications that deliver exceptional user experiences.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">Skills</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-10">What I work with</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className="osmo-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-[#0a0a0a]">{skill.name}</span>
                  <span className="text-sm font-semibold text-[#525252]">{skill.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0a0a0a] transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Draggable Slider */}
      <section id="projects" className="py-24 px-0 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4 px-6 lg:px-0 max-w-6xl mx-auto">Projects</h2>
        <p className="text-[#737373] text-sm uppercase tracking-widest mb-10 px-6 lg:px-0 max-w-6xl mx-auto">What I&apos;ve built</p>
        <div className="slider__section">
          <div className="slider__overlay">
            <div className="slider__overlay-inner">
              <div className="slider__overlay-count">
                <div className="slider__count-col">
                  <h2 data-slider-step className="slider__count-heading">01</h2>
                </div>
                <div className="slider__count-divider" />
                <div className="slider__count-col">
                  <h2 data-slider-total className="slider__count-heading">00</h2>
                </div>
              </div>
              <div className="slider__overlay-nav">
                <button type="button" aria-label="previous slide" data-slider-prev className="slider__btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow">
                    <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" />
                  </svg>
                  <div className="slider__btn-overlay">
                    <div className="slider__btn-overlay-corner" />
                    <div className="slider__btn-overlay-corner top-right" />
                    <div className="slider__btn-overlay-corner bottom-left" />
                    <div className="slider__btn-overlay-corner bottom-right" />
                  </div>
                </button>
                <button type="button" aria-label="next slide" data-slider-next className="slider__btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow next">
                    <path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" />
                  </svg>
                  <div className="slider__btn-overlay">
                    <div className="slider__btn-overlay-corner" />
                    <div className="slider__btn-overlay-corner top-right" />
                    <div className="slider__btn-overlay-corner bottom-left" />
                    <div className="slider__btn-overlay-corner bottom-right" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="slider__main">
            <div className="slider__wrap">
              <div ref={sliderListRef} data-slider="list" className="slider__list">
                {projects.map((project, idx) => (
                  <div key={project.id} data-slider-slide className={`slider__slide ${idx === 1 ? "active" : ""}`}>
                    <div className="slider__slide-inner">
                      <a href={(project.link && project.link !== "#") ? project.link : project.github} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                        <div className="slide__img-wrap slide__img-placeholder">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={project.image} alt={project.title} className="slide__img" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }} />
                          <span className="slide__img-fallback hidden">{project.title}</span>
                        </div>
                      </a>
                      <div className="slide__caption">
                        <div className="slide__caption-dot" />
                        <p className="slide__caption-label">{project.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Floating project info - syncs with active slide */}
        <div className="max-w-6xl mx-auto mt-12 px-6 lg:px-0">
          <div
            key={activeProjectIndex}
            className="project-info-card osmo-card rounded-2xl p-6 lg:p-8"
          >
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">
              {projects[activeProjectIndex]?.title}
            </h3>
            <p className="text-[#525252] text-sm mb-4 leading-relaxed">
              {projects[activeProjectIndex]?.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {projects[activeProjectIndex]?.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs text-[#525252] rounded-md border border-[#e5e5e5] bg-[#fafafa]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-6">
              {projects[activeProjectIndex]?.link && projects[activeProjectIndex].link !== "#" && (
                <a
                  href={projects[activeProjectIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#0a0a0a] hover:underline"
                >
                  Live Demo →
                </a>
              )}
              <a
                href={projects[activeProjectIndex]?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#0a0a0a] hover:underline"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">Get in Touch</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-4">Let&apos;s connect</p>
          <p className="text-[#525252] mb-10 max-w-xl">
            Always open to discussing new projects, creative ideas, or job opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSendEmail}
              className="px-6 py-3 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-[#262626] transition-all duration-300 ease-out"
            >
              Send Email
            </button>
            <a
              href="https://github.com/esqukev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-all duration-300 ease-out"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kevin-bermudez-831442241/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-all duration-300 ease-out"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm text-[#737373]">
            © {new Date().getFullYear()} Kevin Bermudez
          </p>
        </div>
      </footer>
    </main>
  );
}
