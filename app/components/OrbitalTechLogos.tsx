"use client";

import { useEffect, useRef } from "react";

const tech = [
  { name: "HTML", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "SQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
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
        const opacity = 0.25 + depth * 0.75;
        const blur = (1 - depth) * 1.4;

        (item as HTMLElement).style.transform = `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) scale(${scale})`;
        (item as HTMLElement).style.opacity = String(opacity);
        (item as HTMLElement).style.filter = `blur(${blur}px)`;
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
    <div className="relative w-full flex items-center justify-center py-20 overflow-hidden">
      {/* Ambient glow - portfolio colors */}
      <div className="absolute h-[520px] w-[520px] rounded-full bg-[#d8b4fe]/20 blur-[120px]" />
      <div className="absolute h-[420px] w-[420px] rounded-full bg-[#d8b4fe]/10 blur-[110px]" />

      {/* Main container */}
      <div
        ref={containerRef}
        className="relative transition-transform duration-200 ease-out"
        style={{ perspective: "1200px" }}
      >
        <div className="relative h-[360px] w-[720px] max-w-full flex items-center justify-center">
          {/* Ring + logos */}
          <div
            ref={ringRef}
            className="relative h-full w-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(65deg)",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-[#0a0a0a]/10 opacity-50" />
            <div className="absolute inset-0 rounded-full border border-[#d8b4fe]/30 blur-[1px]" />

            {tech.map((item, idx) => (
              <div
                key={idx}
                className="orbital-item absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="group relative h-16 w-16 rounded-2xl bg-white/80 border border-[#0a0a0a]/10 shadow-[0_0_40px_rgba(216,180,254,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-[#d8b4fe]/50 hover:shadow-[0_0_55px_rgba(216,180,254,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-8 w-8 opacity-90 transition-opacity duration-300 group-hover:opacity-100 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Center text */}
          <div className="absolute flex flex-col items-center text-center pointer-events-none">
            <p className="text-xs tracking-[0.45em] text-[#737373] uppercase">
              Tech Stack
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#0a0a0a]">
              Creative Developer
            </h3>
            <p className="mt-2 text-sm text-[#525252] max-w-[320px] leading-relaxed">
              Modern tools. Clean builds. Performance-first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
