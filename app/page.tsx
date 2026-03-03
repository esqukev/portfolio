"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { horizontalLoop } from "@/lib/horizontal-loop";
import { DRAW_SVG_VARIANTS } from "@/lib/draw-svg-variants";
gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = ["Developer", "Designer", "Artist"];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const drawLineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const sliderSectionRef = useRef<HTMLDivElement>(null);
  const aboutP1Ref = useRef<HTMLParagraphElement>(null);
  const aboutP2Ref = useRef<HTMLParagraphElement>(null);
  const aboutWrapRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

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

  // Projects slider - GSAP horizontal loop (from template)
  useEffect(() => {
    const wrapper = document.querySelector("[data-slider=\"list\"]");
    if (!wrapper) return;

    const slides = gsap.utils.toArray<HTMLElement>("[data-slider=\"slide\"]");
    const nextButtons = document.querySelectorAll("[data-slider-button=\"next\"]");
    const prevButtons = document.querySelectorAll("[data-slider-button=\"prev\"]");
    const totalElements = document.querySelectorAll("[data-slide-count=\"total\"]");
    const totalMobileElements = document.querySelectorAll("[data-slide-count=\"total-mobile\"]");
    const stepElement = document.querySelector("[data-slide-count=\"step\"]");
    const stepMobileElement = document.querySelector("[data-slide-count=\"step-mobile\"]");
    const stepsParent = stepElement?.parentElement;
    const stepsMobileParent = stepMobileElement?.parentElement;

    let activeElement: HTMLElement | null = null;
    const totalSlides = slides.length;
    const totalStr = totalSlides < 10 ? `0${totalSlides}` : String(totalSlides);

    totalElements.forEach((el) => { el.textContent = totalStr; });
    totalMobileElements.forEach((el) => { el.textContent = totalStr; });

    function setupSteps(parent: Element | null, stepEl: Element | null, useWrapper = false) {
      if (!parent || !stepEl) return { elements: [] as Element[], wrapper: null as Element | null };
      const stepAttr = stepEl.getAttribute("data-slide-count") || "step";
      const clones: HTMLElement[] = [];
      slides.forEach((_, index) => {
        const stepClone = stepEl.cloneNode(true) as HTMLElement;
        stepClone.setAttribute("data-slide-count", stepAttr);
        stepClone.textContent = index + 1 < 10 ? `0${index + 1}` : String(index + 1);
        clones.push(stepClone);
      });
      parent.innerHTML = "";

      if (useWrapper) {
        const wrapper = document.createElement("div");
        wrapper.className = "slider__step-wrapper";
        clones.forEach((c) => wrapper.appendChild(c));
        parent.appendChild(wrapper);
        return { elements: [], wrapper };
      }
      clones.forEach((c) => parent.appendChild(c));
      return { elements: clones, wrapper: null };
    }

    const desktopSteps = setupSteps(stepsParent ?? null, stepElement ?? null, false);
    const mobileSteps = setupSteps(stepsMobileParent ?? null, stepMobileElement ?? null, true);
    const allSteps = desktopSteps.elements;
    const mobileWrapper = mobileSteps.wrapper;

    let currentEl: HTMLElement | null = null;

    function applyActive(el: HTMLElement, index: number, animateNumbers = true) {
      if (activeElement) activeElement.classList.remove("active");
      el.classList.add("active");
      activeElement = el;

      const desktopY = `${-100 * index}%`;
      const mobileY = `${-index}em`;

      if (animateNumbers) {
        if (allSteps.length) gsap.to(allSteps, { y: desktopY, ease: "power3", duration: 0.45 });
        if (mobileWrapper) gsap.to(mobileWrapper, { y: mobileY, ease: "power3", duration: 0.45 });
      } else {
        if (allSteps.length) gsap.set(allSteps, { y: desktopY });
        if (mobileWrapper) gsap.set(mobileWrapper, { y: mobileY });
      }
    }

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      center: true,
      onChange: (element, index) => {
        currentEl = element;
        applyActive(element, index, true);
        setActiveProjectIndex(index);
      },
    });

    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        if (slide.classList.contains("active")) return;
        loop.toIndex(i, { ease: "power3", duration: 0.725 });
      });
    });

    nextButtons.forEach((btn) => btn.addEventListener("click", () => loop.next({ ease: "power3", duration: 0.725 })));
    prevButtons.forEach((btn) => btn.addEventListener("click", () => loop.previous({ ease: "power3", duration: 0.725 })));

    if (!currentEl && slides[0]) {
      currentEl = slides[0];
      applyActive(slides[0], 0, false);
      setActiveProjectIndex(0);
    }
    loop.toIndex(0, { duration: 0 });
  }, []);



  // Button character stagger animation (hero + contact buttons)
  useLayoutEffect(() => {
    const offsetIncrement = 0.01;
    const buttons = document.querySelectorAll("[data-button-animate-chars]");

    buttons.forEach((button) => {
      const text = button.textContent ?? "";
      if (!text.trim()) return;
      button.innerHTML = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        (span as HTMLElement).style.transitionDelay = `${index * offsetIncrement}s`;
        if (char === " ") (span as HTMLElement).style.whiteSpace = "pre";
        button.appendChild(span);
      });
    });
  }, []);

  // Looping words for skills (template-based)
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
    tl.call(moveWords).to({}, { duration: 2 });

    return () => { tl.kill(); };
  }, []);

  // About text: fade-in + parallax on scroll
  useEffect(() => {
    const p1 = aboutP1Ref.current;
    const p2 = aboutP2Ref.current;
    const wrap = aboutWrapRef.current;
    if (!p1 || !p2 || !wrap) return;

    gsap.set([p1, p2], { opacity: 0, y: 60 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 1.2,
      },
    });
    tl.to(p1, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0)
      .to(p2, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0.15);

    // Parallax: paragraphs move at different rates
    gsap.to(p1, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
    gsap.to(p2, {
      yPercent: -4,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Scroll reveal: Skills, Projects, Contact
  useEffect(() => {
    const sections = [skillsRef.current, projectsRef.current, contactRef.current].filter(Boolean) as HTMLElement[];
    const anims = sections.map((el) =>
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      })
    );
    return () => anims.forEach((a) => a.kill());
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
      title: "Upcoming project",
      description: "More projects will display here",
      technologies: ["More projects will display here"],
      image: "/blancbg.jpg",
      link: "",
      github: "",
      comingSoon: true,
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
    const email = "kevinbermudez94@hotmail.com";
    const subject = "Contact from Portfolio";
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a] relative overflow-x-hidden font-sans" role="main">
      {/* Formas difuminadas: zona superior + una abajo izquierda; Skills/Projects encima (z-10) */}
      <div className="page-shapes" aria-hidden>
        <div className="page-shapes__blob page-shapes__blob--1" />
        <div className="page-shapes__blob page-shapes__blob--4" />
      </div>
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
          <div className="nav-inner flex justify-center items-center h-14 px-6 gap-8">
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
      <section ref={heroRef} id="home" className="pt-40 pb-32 px-6 lg:px-8 relative overflow-visible">
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.95] tracking-tight text-[#0a0a0a] animate-fade-in">
            Web{" "}
            <span ref={wordRef} className="hero-rotating-word inline-block overflow-visible">
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
          <div className="mt-12 flex gap-4 animate-fade-in delay-400 overflow-visible">
            <a href="#projects" className="btn-animate-chars btn-animate-chars--filled" aria-label="View Work">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">View Work</span>
            </a>
            <a href="#contact" className="btn-animate-chars btn-animate-chars--outline" aria-label="Get in Touch">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">Get in Touch</span>
            </a>
          </div>
        </div>
      </section>

      {/* About - centered, large text, fade-in + parallax */}
      <section ref={aboutRef} id="about" className="pt-32 pb-24 px-6 lg:px-8 relative overflow-hidden">
        <div ref={aboutWrapRef} className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <p ref={aboutP1Ref} className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#404040] leading-tight mb-5 text-center">
            I&apos;m a passionate web developer with expertise in building modern, scalable web applications.
            I love turning complex problems into simple, beautiful, and intuitive solutions.
          </p>
          <p ref={aboutP2Ref} className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#404040] leading-tight text-center">
            With a strong foundation in front-end and back-end technologies, I enjoy creating
            full-stack applications that deliver exceptional user experiences.
          </p>
        </div>
      </section>

      {/* Skills Section - Looping words (encima de formas, sin destellos detrás) */}
      <section ref={skillsRef} id="skills" className="py-24 px-6 lg:px-8 relative z-10">
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

      {/* Projects Section - GSAP Slider (encima de formas, sin destellos detrás) */}
      <section ref={projectsRef} id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: PROJECTS header above slider (overlay hidden on mobile) */}
        <div className="lg:hidden mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a] uppercase">PROJECTS</h2>
          <p className="text-[#737373] text-xs uppercase tracking-widest mt-1">What I&apos;ve built</p>
        </div>
        <div ref={sliderSectionRef} className="slider__section">
          <div className="slider__overlay">
            <div className="slider__overlay-inner">
              <div className="slider__overlay-header">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-1 uppercase">PROJECTS</h2>
                <p className="text-[#737373] text-sm uppercase tracking-widest">What I&apos;ve built</p>
              </div>
              <div className="slider__overlay-count">
                <div className="slider__count-col">
                  <h2 data-slide-count="step" className="slider__count-heading">01</h2>
                </div>
                <div className="slider__count-divider" />
                <div className="slider__count-col">
                  <h2 data-slide-count="total" className="slider__count-heading">03</h2>
                </div>
              </div>
              <div className="slider__overlay-nav">
                <button type="button" aria-label="previous slide" data-slider-button="prev" className="slider__btn">
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
                <button type="button" aria-label="next slide" data-slider-button="next" className="slider__btn">
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
              <div data-slider="list" className="slider__list">
                {projects.map((project, idx) => (
                  <div key={project.id} data-slider="slide" className={`slider__slide ${idx === 0 ? "active" : ""}`}>
                    <div className="slider__slide-inner">
                      <div className="block w-full h-full">
                        <div className={`slide__img-wrap slide__img-placeholder ${project.comingSoon ? "slide__img-wrap--coming-soon" : ""}`}>
                          {project.image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={project.image} alt={project.title} className="slide__img" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }} />
                              <span className="slide__img-fallback hidden">{project.title}</span>
                              {project.comingSoon && (
                                <span className="slide__img-placeholder-text slide__img-placeholder-overlay">More projects will display here</span>
                              )}
                            </>
                          ) : (
                            <span className="slide__img-placeholder-text">More projects will display here</span>
                          )}
                        </div>
                      </div>
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
        {/* Mobile: count 01/03 + arrows BELOW slider (hidden on desktop via CSS) */}
        <div className="slider__mobile-footer mt-6">
          <div className="slider__overlay-count slider__overlay-count--mobile">
            <div className="slider__count-col">
              <h2 data-slide-count="step-mobile" className="slider__count-heading">01</h2>
            </div>
            <div className="slider__count-divider" />
            <div className="slider__count-col">
              <h2 data-slide-count="total-mobile" className="slider__count-heading">03</h2>
            </div>
          </div>
          <div className="slider__overlay-nav">
            <button type="button" aria-label="previous slide" data-slider-button="prev" className="slider__btn slider__btn--mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow"><path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" /></svg>
            </button>
            <button type="button" aria-label="next slide" data-slider-button="next" className="slider__btn slider__btn--mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 17 12" fill="none" className="slider__btn-arrow next"><path d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z" fill="currentColor" /></svg>
            </button>
          </div>
        </div>
        <div className="mt-4 lg:mt-12 max-w-6xl mx-auto">
          <div className="flex-1 min-w-0">
          <div
            key={activeProjectIndex}
            className="project-info-floating"
          >
            <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">
              {projects[activeProjectIndex]?.title}
            </h3>
            <p className="text-[#737373] text-sm mb-4 leading-relaxed">
              {projects[activeProjectIndex]?.description}
            </p>
            {projects[activeProjectIndex]?.technologies && projects[activeProjectIndex].technologies.length > 0 && (
              <p className="text-[#737373] text-sm mb-4">
                {projects[activeProjectIndex].technologies.join(" · ")}
              </p>
            )}
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
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">Get in Touch</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-4">Let&apos;s connect</p>
          <p className="text-[#737373] mb-10 max-w-xl">
            Always open to discussing new projects, creative ideas, or job opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={handleSendEmail} className="btn-animate-chars btn-animate-chars--filled" aria-label="Send Email">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">Send Email</span>
            </button>
            <a href="https://wa.me/50661371097" target="_blank" rel="noopener noreferrer" className="btn-animate-chars btn-animate-chars--outline" aria-label="WhatsApp">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">WhatsApp</span>
            </a>
            <a href="https://github.com/esqukev" target="_blank" rel="noopener noreferrer" className="btn-animate-chars btn-animate-chars--outline" aria-label="GitHub">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/kevin-bermudez-831442241/" target="_blank" rel="noopener noreferrer" className="btn-animate-chars btn-animate-chars--outline" aria-label="LinkedIn">
              <div className="btn-animate-chars__bg" />
              <span data-button-animate-chars className="btn-animate-chars__text">LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col justify-center items-center gap-4 text-center w-full">
          <div className="flex gap-6">
            <a href="https://github.com/esqukev" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/kevin-bermudez-831442241/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://wa.me/50661371097" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#737373] hover:text-[#0a0a0a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
          <p className="text-sm text-[#737373]">
            © {new Date().getFullYear()} Kevin Bermudez
          </p>
        </div>
      </footer>
      {/* Asterisk - right edge, scrolls with page, 400px lower */}
      <div className="asterisk-hover-zone absolute right-0 top-[calc(15vh+400px)] w-32 h-32 z-[25] select-none" aria-hidden>
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
