"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const ROTATING_WORDS = ["Developer", "Designer", "Artist"];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

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
      {/* Asterisk - right edge, coming out of screen */}
      <div
        className="fixed right-0 top-1/2 z-0 pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-leckerli-one), cursive",
          fontSize: "1200px",
          color: "rgba(0,0,0,0.08)",
          transform: "translate(calc(50% - 30px), calc(-50% + 200px)) rotate(-15deg)",
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
        {/* Animated strip - infinite billboard, seamless */}
        <div
          className="mt-1 rounded-2xl overflow-hidden border-none"
          style={{
            background: "linear-gradient(90deg, #e9d5ff 0%, #d8b4fe 50%, #e9d5ff 100%)",
          }}
        >
          <div className="py-2.5 overflow-hidden">
            <div className="flex w-max animate-marquee-seamless gap-0">
              {[1, 2].map((i) => (
                <span key={i} className="flex-shrink-0 text-sm font-medium text-[#6b21a8]/90 tracking-[0.3em] whitespace-nowrap">
                  EXPLORE * DESIGN * CREATE * IMAGINE * ELEVATE *{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.95] tracking-tight text-[#0a0a0a] animate-fade-in">
            Web{" "}
            <span ref={wordRef} className="inline-block overflow-visible">
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-[#525252] animate-slide-left">
            Innovative Design
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
      <section id="about" className="py-24 px-6 lg:px-8 relative">
        {/* Rotating asterisk ring - behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[480px] h-[480px] flex items-center justify-center">
            <div className="absolute inset-0 animate-spin-slow">
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (360 / 18) * i;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 text-3xl font-extrabold"
                    style={{
                      color: "rgba(216, 180, 254, 0.65)",
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

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">Projects</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-10">What I&apos;ve built</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="osmo-card rounded-2xl overflow-hidden group">
                <div className="h-48 bg-[#171717] flex items-center justify-center relative overflow-hidden">
                  <span className="text-white text-2xl font-bold">{project.title}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-3">{project.title}</h3>
                  <p className="text-[#525252] text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs text-[#525252] rounded-md border border-[#e5e5e5] bg-[#fafafa]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-6">
                    {project.link && project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0a0a0a] hover:underline">
                        Live Demo →
                      </a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0a0a0a] hover:underline">
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
