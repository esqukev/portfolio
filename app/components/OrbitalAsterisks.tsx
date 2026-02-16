"use client";

import { useEffect, useRef } from "react";

const ASTERSIK_COUNT = 18;

export default function OrbitalAsterisks() {
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle = 0;
    let raf: number;

    const animate = () => {
      angle += 0.35;

      const ring = ringRef.current;
      if (!ring) return;

      const items = ring.querySelectorAll(".orbital-asterisk-item");

      items.forEach((item, i) => {
        const total = items.length;
        const theta = (i / total) * Math.PI * 2 + angle * 0.01;

        const x = Math.cos(theta) * 220;
        const z = Math.sin(theta) * 130;

        const depth = (z + 130) / 260;
        const scale = 0.7 + depth * 0.6;
        const opacity = 0.15 + depth * 0.5;

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
      const rotateY = ((x - midX) / midX) * 8;
      const rotateX = ((y - midY) / midY) * -6;
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
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={ringRef}
        className="relative w-[480px] h-[480px] flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(65deg)",
        }}
      >
        {Array.from({ length: ASTERSIK_COUNT }).map((_, i) => (
          <div
            key={i}
            className="orbital-asterisk-item absolute left-1/2 top-1/2 flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              fontFamily: "var(--font-leckerli-one), cursive",
              fontSize: "4rem",
              color: "rgb(216, 180, 254)",
            }}
          >
            *
          </div>
        ))}
      </div>
    </div>
  );
}
