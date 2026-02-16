"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { horizontalLoop } from "@/lib/horizontal-loop";
import { DRAW_SVG_VARIANTS } from "@/lib/draw-svg-variants";

const ROTATING_WORDS = ["Developer", "Designer", "Artist"];

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

  // Draw underline effect on hover + every 4s (stroke-dashoffset, no paid plugin)
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

    const runCycle = () => {
      onEnter();
      gsap.delayedCall(2, () => {
        onLeave();
      });
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    const interval = setInterval(runCycle, 4000);
    gsap.delayedCall(0.5, runCycle);

    return () => {
      clearInterval(interval);
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
    const nextBtns = document.querySelectorAll("[data-slider-next]");
    const prevBtns = document.querySelectorAll("[data-slider-prev]");
    const totalEl = document.querySelector("[data-slider-total]");
    const totalElMobile = document.querySelector("[data-slider-total-mobile]");
    const stepEl = document.querySelector("[data-slider-step]");
    const stepElMobile = document.querySelector("[data-slider-step-mobile]");
    const stepsParent = stepEl?.parentElement;
    const stepsParentMobile = stepElMobile?.parentElement;

    let activeElement: HTMLElement | null = null;
    const totalSlides = slides.length;

    [totalEl, totalElMobile].forEach((el) => { if (el) el.textContent = totalSlides < 10 ? `0${totalSlides}` : String(totalSlides); });
    [stepEl, stepElMobile].forEach((sel) => {
      const parent = sel?.parentElement;
      if (parent && sel) {
        parent.innerHTML = "";
        slides.forEach((_, i) => {
          const clone = sel.cloneNode(true) as HTMLElement;
          clone.textContent = i + 1 < 10 ? `0${i + 1}` : String(i + 1);
          parent.appendChild(clone);
        });
      }
    });
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

    const allStepsMobile = stepsParentMobile?.querySelectorAll("[data-slider-step-mobile]") ?? [];

    const applyActive = (el: HTMLElement, index: number, animateNumbers = true) => {
      if (activeElement) activeElement.classList.remove("active");
      const target = resolveActive(el);
      target.classList.add("active");
      activeElement = target;
      const stepsToAnimate = allSteps.length ? allSteps : allStepsMobile;
      if (stepsToAnimate.length && animateNumbers) {
        gsap.to(stepsToAnimate, { y: `${-100 * index}%`, ease: "power3", duration: 0.45 });
      } else if (stepsToAnimate.length) {
        gsap.set(stepsToAnimate, { y: `${-100 * index}%` });
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

    nextBtns.forEach((btn) => btn.addEventListener("click", () => loop.next({ ease: "power3", duration: 0.725 })));
    prevBtns.forEach((btn) => btn.addEventListener("click", () => loop.previous({ ease: "power3", duration: 0.725 })));

    // Mouse drag for desktop
    let dragCleanup: (() => void) | undefined;
    const wrap = list.parentElement;
    if (wrap && typeof window !== "undefined" && window.matchMedia("(min-width: 992px)").matches) {
      let startX = 0;
      let startProgress = 0;
      const onMouseDown = (e: MouseEvent) => {
        startX = e.clientX;
        startProgress = loop.progress();
        gsap.killTweensOf(loop);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };
      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const totalWidth = (wrap as HTMLElement).offsetWidth;
        if (totalWidth > 0) {
          const delta = -dx / totalWidth;
          let p = startProgress + delta;
          p = Math.max(0, Math.min(1, p));
          loop.progress(p);
          const idx = loop.closestIndex();
          if (currentEl !== slides[idx]) {
            currentEl = slides[idx];
            currentIndex = idx;
            applyActive(currentEl, currentIndex, true);
            setActiveProjectIndex(idx);
          }
        }
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        const idx = loop.closestIndex(true);
        loop.toIndex(idx, { ease: "power3", duration: 0.4 });
      };
      wrap.addEventListener("mousedown", onMouseDown);
      dragCleanup = () => {
        wrap.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }

    if (!currentEl && slides[0]) {
      currentEl = slides[0];
      currentIndex = 0;
      applyActive(currentEl, currentIndex, false);
    }

    return () => {
      nextBtns.forEach((btn) => btn.removeEventListener("click", () => {}));
      prevBtns.forEach((btn) => btn.removeEventListener("click", () => {}));
      dragCleanup?.();
    };
  }, []);

  // Looping words for skills
  useEffect(() => {
    const wordList = document.querySelector("[data-looping-words-list]");
    const edgeElement = document.querySelector("[data-looping-words-selector]");
    if (!wordList || !edgeElement) return;

    const words = Array.from(wordList.children);
    const totalWords = words.length;
    if (totalWords === 0) return;

    const wordHeight = 100 / totalWords;
    let currentIndex = 0;

    const updateEdgeWidth = () => {
      const centerIndex = (currentIndex + 1) % totalWords;
      const centerWord = words[centerIndex] as HTMLElement;
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = (wordList as HTMLElement).getBoundingClientRect().width;
      const percentageWidth = listWidth > 0 ? (centerWordWidth / listWidth) * 100 : 100;

      gsap.to(edgeElement, {
        width: `${percentageWidth}%`,
        duration: 0.5,
        ease: "expo.out",
      });
    };

    const moveWords = () => {
      currentIndex++;

      gsap.to(wordList, {
        yPercent: -wordHeight * currentIndex,
        duration: 1.2,
        ease: "elastic.out(1, 0.85)",
        onStart: updateEdgeWidth,
        onComplete: () => {
          if (currentIndex >= totalWords - 3) {
            wordList.appendChild(wordList.children[0]);
            currentIndex--;
            gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
            words.push(words.shift()!);
          }
        },
      });
    };

    updateEdgeWidth();

    const tl = gsap.timeline({ repeat: -1, delay: 1 });
    tl.call(moveWords).to({}, { duration: 2 }).repeat(-1);

    return () => { tl.kill(); };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Artist Press Kit",
      description: "Showcase your art with a fully functional-minimal design press kit to make you stand out and look professional.",
      technologies: ["Next.js", "JavaScript", "Vercel", "Reactive", "Tailwind CSS"],
      image: "/killer.png",
      link: "https://www.killernugget.com/",
      github: "https://github.com/esqukev/KillerWeb2",
    },
    {
      id: 2,
      title: "Brand Presentation",
      description: "Immersive visual experiences — crafting tailored visuals that push the boundaries of your vision.",
      technologies: ["Next.js", "TypeScript", "CSS", "Tailwind", "React", "GSAP", "Lenis", "Open Graph"],
      image: "/planbfx.png",
      link: "https://www.planb-fx.com/",
      github: "https://github.com/esqukev/planbfx-final-site",
    },
    {
      id: 3,
      title: "Auction",
      description: "A complete website for auctioning collection items focused on back end.",
      technologies: ["Html", "CSS", "Javascript", "API", "Postman", "JSON"],
      image: "/auction.png",
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
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;
    window.open(gmailLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a] relative overflow-x-hidden" role="main">
      {/* Nav - sticky at top, centered */}
      <div className="sticky top-0 z-50 pt-6 pb-2 px-4 flex justify-center">
        <div className="w-full max-w-[42rem] mx-4 transition-all duration-500 ease-out">
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
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#737373] leading-tight mb-5 animate-fade-in-slow">
            I&apos;m a passionate web developer with expertise in building modern, scalable web applications.
            I love turning complex problems into simple, beautiful, and intuitive solutions.
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#737373] leading-tight animate-fade-in-slow delay-200">
            With a strong foundation in front-end and back-end technologies, I enjoy creating
            full-stack applications that deliver exceptional user experiences.
          </p>
        </div>
      </section>

      {/* Skills Section - Looping words */}
      <section id="skills" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4 text-center uppercase">SKILLS</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-10 text-center">What I work with</p>
          <div className="looping-words">
            <div className="looping-words__containers">
              <ul data-looping-words-list className="looping-words__list">
                {skills.map((skill) => (
                  <li key={skill.name} className="looping-words__item">
                    <p className="looping-words__p">{skill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="looping-words__fade" />
            <div data-looping-words-selector className="looping-words__selector">
              <div className="looping-words__edge" />
              <div className="looping-words__edge is--2" />
              <div className="looping-words__edge is--3" />
              <div className="looping-words__edge is--4" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Draggable Slider */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
        {/* Mobile: PROJECTS + WHAT I'VE BUILT at top left */}
        <div className="lg:hidden mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] mb-1 uppercase">PROJECTS</h2>
          <p className="text-[#737373] text-xs uppercase tracking-widest">What I&apos;ve built</p>
        </div>
        <div className="slider__section">
          <div className="slider__overlay hidden lg:flex">
            <div className="slider__overlay-inner">
              <div className="slider__overlay-header">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-1 uppercase">PROJECTS</h2>
                <p className="text-[#737373] text-sm uppercase tracking-widest">What I&apos;ve built</p>
              </div>
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
        {/* Mobile: 01/05 + arrows below cards */}
        <div className="lg:hidden flex items-center gap-4 mt-6">
          <div className="slider__overlay-count flex items-center gap-2">
            <div className="slider__count-col">
              <h2 data-slider-step-mobile className="slider__count-heading text-2xl">01</h2>
            </div>
            <div className="slider__count-divider" />
            <div className="slider__count-col">
              <h2 data-slider-total-mobile className="slider__count-heading text-2xl">00</h2>
            </div>
          </div>
          <div className="slider__overlay-nav flex gap-4">
            <button type="button" aria-label="previous" data-slider-prev className="slider__btn w-12 h-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow"><path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" /></svg>
            </button>
            <button type="button" aria-label="next" data-slider-next className="slider__btn w-12 h-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow next"><path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" /></svg>
            </button>
          </div>
        </div>
        {/* Floating project info - syncs with active slide */}
        <div className="max-w-6xl mx-auto mt-8 lg:mt-12 px-0 lg:px-0">
          <div
            key={activeProjectIndex}
            className="project-info-floating"
          >
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">
              {projects[activeProjectIndex]?.title}
            </h3>
            <p className="text-[#525252] text-sm mb-4 leading-relaxed">
              {projects[activeProjectIndex]?.description}
            </p>
            <p className="text-[#525252] text-sm mb-4">
              {projects[activeProjectIndex]?.technologies.join(" · ")}
            </p>
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
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <p className="text-sm text-[#737373]">
            © {new Date().getFullYear()} Kevin Bermudez
          </p>
        </div>
      </footer>
      {/* Asterisk - right edge, fixed at top of first section */}
      <div className="asterisk-hover-zone fixed right-0 top-[15vh] w-32 h-32 z-[25] select-none" aria-hidden>
        <div
          className="asterisk-right"
          style={{
            fontFamily: "var(--font-leckerli-one), cursive",
            fontSize: "1200px",
            lineHeight: 1,
          }}
        >
          *
        </div>
      </div>
    </div>
  );
}
