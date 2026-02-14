"use client";

export default function Home() {
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
      title: "Auction",
      description: "A complete website for auctioning collection items focused on back end.",
      technologies: ["Html", "CSS", "Javascript", "API", "Postman", "JSON"],
      image: "/project-2.jpg",
      link: "",
      github: "https://github.com/esqukev/auction.git",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Beautiful weather application with location-based forecasts and interactive charts.",
      technologies: ["Vue.js", "Chart.js", "OpenWeather API", "CSS3"],
      image: "/project-3.jpg",
      link: "#",
      github: "#",
    },
    {
      id: 4,
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
    <main className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a]">
      {/* Navigation - Osmo style */}
      <nav className="fixed top-0 w-full z-50 bg-[#f5f5f5]/95 backdrop-blur-sm border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#home" className="text-lg font-semibold tracking-tight text-[#0a0a0a]">
              KB
            </a>
            <div className="hidden md:flex items-center gap-8">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-[#525252] hover:text-[#0a0a0a] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Osmo style */}
      <section id="home" className="pt-40 pb-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.95] tracking-tight text-[#0a0a0a] animate-fade-in">
            Web
            <br />
            Developer
          </h1>
          <h2 className="mt-6 text-3xl md:text-4xl font-semibold text-[#525252] animate-fade-in delay-200">
            Built to Flex
          </h2>
          <p className="mt-8 max-w-xl text-lg text-[#737373] leading-relaxed animate-fade-in delay-200">
            I create beautiful, functional web experiences. Full-stack development with modern technologies.
          </p>
          <div className="mt-12 flex gap-4 animate-fade-in delay-400">
            <a
              href="#projects"
              className="inline-block px-6 py-3 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-[#262626] transition-colors"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-block px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section - Osmo style */}
      <section id="about" className="py-24 px-6 lg:px-8 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">About</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-10">Who I am</p>
          <div className="osmo-card rounded-2xl p-10 md:p-14">
            <p className="text-lg text-[#525252] leading-relaxed mb-6">
              I&apos;m a passionate web developer with expertise in building modern, scalable web applications.
              I love turning complex problems into simple, beautiful, and intuitive solutions.
            </p>
            <p className="text-lg text-[#525252] leading-relaxed mb-6">
              With a strong foundation in front-end and back-end technologies, I enjoy creating
              full-stack applications that deliver exceptional user experiences.
            </p>
            <p className="text-lg text-[#525252] leading-relaxed">
              When I&apos;m not coding, you can find me exploring new frameworks, visual design, or sharing knowledge with the developer community.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section - Osmo style */}
      <section id="skills" className="py-24 px-6 lg:px-8 border-t border-[#e5e5e5]">
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

      {/* Projects Section - Osmo style */}
      <section id="projects" className="py-24 px-6 lg:px-8 border-t border-[#e5e5e5]">
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

      {/* Contact Section - Osmo style */}
      <section id="contact" className="py-24 px-6 lg:px-8 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] mb-4">Get in Touch</h2>
          <p className="text-[#737373] text-sm uppercase tracking-widest mb-4">Let&apos;s connect</p>
          <p className="text-[#525252] mb-10 max-w-xl">
            Always open to discussing new projects, creative ideas, or job opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSendEmail}
              className="px-6 py-3 bg-[#0a0a0a] text-white text-sm font-medium rounded-lg hover:bg-[#262626] transition-colors"
            >
              Send Email
            </button>
            <a
              href="https://github.com/esqukev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kevin-bermudez-831442241/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[#0a0a0a] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#0a0a0a] hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Osmo style */}
      <footer className="py-10 px-6 lg:px-8 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm text-[#737373]">
            © {new Date().getFullYear()} Kevin Bermudez
          </p>
        </div>
      </footer>
    </main>
  );
}
