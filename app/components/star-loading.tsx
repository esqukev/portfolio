"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LETTERS_STAR = ["S", "t", "a", "r"];
const LETTERS_DEV = ["D", "e", "v"];

export function StarLoading({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loadingLetters = container.querySelectorAll(".star-loading__letter");
    const box = container.querySelector(".star-loading__box");
    const growingImage = container.querySelector(".star-loading__growing");
    const headingStart = container.querySelector(".star-loading__start");
    const headingEnd = container.querySelector(".star-loading__end");
    const headerLetters = container.querySelectorAll(".star-loading__letter-white");

    setMounted(true);

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => container.classList.remove("is--hidden"),
      onComplete: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            container.classList.remove("is--loading");
            container.style.display = "none";
            onComplete();
          },
        });
      },
    });

    if (loadingLetters.length) {
      tl.from(loadingLetters, { yPercent: 100, stagger: 0.025, duration: 1.25 });
    }
    if (box && growingImage) {
      tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1.25 }, "< 1.25");
      tl.fromTo(growingImage, { width: "0%" }, { width: "100%", duration: 1.25 }, "<");
    }
    if (headingStart && headingEnd) {
      tl.fromTo(headingStart, { x: "0em" }, { x: "-0.05em", duration: 1.25 }, "<");
      tl.fromTo(headingEnd, { x: "0em" }, { x: "0.05em", duration: 1.25 }, "<");
    }
    if (box && growingImage) {
      tl.to(growingImage, { width: "100vw", height: "100dvh", duration: 2 }, "< 1.25");
      tl.to(box, { width: "110vw", duration: 2 }, "<");
    }
    if (headerLetters.length) {
      tl.from(headerLetters, { yPercent: 100, duration: 1.25, ease: "expo.out", stagger: 0.025 }, "< 1.2");
    }
  }, [onComplete]);

  return (
    <section
      ref={containerRef}
      className={`star-loading is--loading is--hidden ${mounted ? "" : ""}`}
      aria-hidden="true"
    >
      <div className="star-loading__loader">
        <div className="star-loading__h1">
          <div className="star-loading__start">
            {LETTERS_STAR.map((l) => (
              <span key={l} className="star-loading__letter">
                {l}
              </span>
            ))}
          </div>
          <div className="star-loading__box">
            <div className="star-loading__box-inner">
              <div className="star-loading__growing">
                <div className="star-loading__growing-wrap">
                  <div
                    className="star-loading__cover"
                    style={{
                      background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #262626 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="star-loading__end">
            {LETTERS_DEV.map((l) => (
              <span key={l} className="star-loading__letter">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="star-loading__content">
        <div className="star-loading__bottom">
          <div className="star-loading__h1 star-loading__h1--white">
            {[...LETTERS_STAR, " ", ...LETTERS_DEV].map((l, i) => (
              <span key={i} className="star-loading__letter-white">
                {l === " " ? "\u00A0" : l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
