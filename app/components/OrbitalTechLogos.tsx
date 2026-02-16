"use client";

import { useEffect, useRef } from "react";

const tech = [
  { name: "HTML", src: "/html.svg" },
  { name: "CSS", src: "/css.svg" },
  { name: "JavaScript", src: "/javascript.svg" },
  { name: "Next.js", src: "/next-js.svg" },
  { name: "Tailwind", src: "/tailwind.svg" },
  { name: "MongoDB", src: "/mongodb.svg" },
  { name: "SQL", src: "/sql.svg" },
  { name: "Git", src: "/git.svg" },
  { name: "Node.js", src: "/nodejs.svg" },
];

export default function OrbitalTechLogos() {
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let raf: number;

    const animate = () => {
      angle += 0.35;

      const ring = ringRef.current;
      if (!ring) return;

      const items = ring.querySelectorAll(".orbital-item");

      items.forEach((item, i) => {
        const total = items.length;

        const theta = (i / total) * Math.PI * 2 + angle * 0.01;

        // Ellipse orbit
        const x = Math.cos(theta) * 250;
        const z = Math.sin(theta) * 150;

        // Depth illusion
        const depth = (z + 150) / 300; // 0 to 1
        const scale = 0.65 + depth * 0.65;
        const opacity = 0.4 + depth * 0.6;

        (item as HTMLElement).style.transform = `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) scale(${scale})`;
        (item as HTMLElement).style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * 10;
      const rotateX = ((y - midY) / midY) * -8;

      container.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center py-20 overflow-hidden bg-transparent">
      <div
        ref={containerRef}
        className="relative transition-transform duration-200 ease-out"
        style={{ perspective: "1200px" }}
      >
        <div className="relative h-[360px] w-[720px] max-w-full flex items-center justify-center">
          <div
            ref={ringRef}
            className="relative h-full w-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(65deg)",
            }}
          >
            {tech.map((item, idx) => (
              <div
                key={idx}
                className="orbital-item absolute left-1/2 top-1/2 flex items-center justify-center w-20 h-20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="group relative w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain transition-opacity duration-300 group-hover:opacity-100"
                    style={{ filter: "brightness(0)", minWidth: 64, minHeight: 64 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute flex flex-col items-center text-center pointer-events-none">
            <p className="text-xs tracking-[0.45em] text-[#525252] uppercase opacity-90">
              TECH STACK
            </p>
            <p className="mt-3 text-sm text-[#525252] max-w-[320px] leading-relaxed opacity-90 uppercase tracking-wide">
              Modern tools. Clean builds. Performance-first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
