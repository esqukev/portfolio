# Código relacionado a los cards de PROJECTS

Este archivo contiene todo el código relevante para que puedas arreglar el comportamiento de los cards en mobile.

## 1. page.tsx - Proyectos data

```typescript
const projects = [
  {
    id: 1,
    title: "Artist Press Kit",
    description: "...",
    technologies: [...],
    image: "/killer.png",
    link: "...",
    github: "...",
  },
  // ... 4 más
];
```

## 2. page.tsx - useEffect del slider (líneas ~124-280)

```typescript
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

  // Inicializa contadores 01/05
  [totalEl, totalElMobile].forEach((el) => { ... });
  [stepEl, stepElMobile].forEach((sel) => { ... });

  const allSteps = stepsParent?.querySelectorAll("[data-slider-step]") ?? [];
  const allStepsMobile = stepsParentMobile?.querySelectorAll("[data-slider-step-mobile]") ?? [];

  let currentEl: HTMLElement | null = null;
  let currentIndex = 0;

  const resolveActive = (el: HTMLElement) => el;

  const applyActive = (el: HTMLElement, index: number, animateNumbers = true) => {
    if (activeElement) activeElement.classList.remove("active");
    const target = resolveActive(el);
    target.classList.add("active");
    activeElement = target;
    // Anima los números 01, 02, etc.
    gsap.to(stepsToAnimate, { y: `${-100 * index}%`, ... });
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
  loop.toIndex(0, { duration: 0 });

  // Click en slides
  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => { ... });
  });

  // Botones prev/next
  nextBtns.forEach((btn) => btn.addEventListener("click", () => loop.next(...)));
  prevBtns.forEach((btn) => btn.addEventListener("click", () => loop.previous(...)));

  // Mouse drag desktop (solo >= 992px)
  if (section && window.matchMedia("(min-width: 992px)").matches) {
    // mousedown, mousemove, mouseup
  }

  // Estado inicial
  if (!currentEl && slides[0]) {
    currentEl = slides[0];
    currentIndex = 0;
    applyActive(currentEl, currentIndex, false);
  }

  return () => { /* cleanup */ };
}, []);
```

## 3. page.tsx - JSX del slider

```jsx
<section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
  {/* Mobile: PROJECTS + WHAT I'VE BUILT */}
  <div className="lg:hidden mb-6">
    <h2>PROJECTS</h2>
    <p>What I've built</p>
  </div>

  <div ref={sliderSectionRef} className="slider__section">
    {/* Desktop overlay - hidden en mobile */}
    <div className="slider__overlay hidden lg:flex">
      <div className="slider__overlay-inner">
        <div className="slider__overlay-header">
          <h2>PROJECTS</h2>
          <p>What I've built</p>
        </div>
        <div className="slider__overlay-count">
          <div className="slider__count-col">
            <h2 data-slider-step>01</h2>
          </div>
          <div className="slider__count-divider" />
          <div className="slider__count-col">
            <h2 data-slider-total>00</h2>
          </div>
        </div>
        <div className="slider__overlay-nav">
          <button data-slider-prev>...</button>
          <button data-slider-next>...</button>
        </div>
      </div>
    </div>

    <div className="slider__main">
      <div className="slider__wrap">
        <div ref={sliderListRef} data-slider="list" className="slider__list">
          {projects.map((project, idx) => (
            <div key={project.id} data-slider-slide className={`slider__slide ${idx === 0 ? "active" : ""}`}>
              <div className="slider__slide-inner">
                <a href={...}>
                  <div className="slide__img-wrap slide__img-placeholder">
                    <img src={project.image} alt={project.title} />
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

  {/* Mobile: 01/05 + flechas debajo de cards */}
  <div className="lg:hidden flex items-center gap-4 mt-6">
    <div className="slider__overlay-count flex items-center gap-2">
      <div className="slider__count-col">
        <h2 data-slider-step-mobile>01</h2>
      </div>
      <div className="slider__count-divider" />
      <div className="slider__count-col">
        <h2 data-slider-total-mobile>00</h2>
      </div>
    </div>
    <div className="slider__overlay-nav flex gap-4">
      <button data-slider-prev>...</button>
      <button data-slider-next>...</button>
    </div>
  </div>

  {/* Info del proyecto activo */}
  <div className="max-w-6xl mx-auto mt-6 lg:mt-12">
    <div key={activeProjectIndex} className="project-info-floating">
      <h3>{projects[activeProjectIndex]?.title}</h3>
      <p>{projects[activeProjectIndex]?.description}</p>
      <p>{projects[activeProjectIndex]?.technologies.join(" · ")}</p>
      <a href={...}>Live Demo →</a>
      <a href={...}>GitHub →</a>
    </div>
  </div>
</section>
```

## 4. globals.css - Estilos del slider

### Desktop
- `.slider__section` - contenedor flex centrado
- `.slider__main` - position absolute, overflow hidden
- `.slider__wrap` - flex row
- `.slider__list` - flex row
- `.slider__slide` - width 36vw, aspect-ratio 3/2, opacity 0.35 (inactivo), opacity 1 (active)
- `.slide__caption` - visible en desktop

### Mobile (@media max-width: 991px)
- `.slider__section` - min-height 40vh
- `.slider__main` - position relative
- `.slider__slide` - width 85vw
- `.slide__caption` - display: none

### Mobile (@media max-width: 479px)
- `.slider__slide` - width 90vw

## 5. lib/horizontal-loop.ts

Función `horizontalLoop(items, config)` que:
- Usa GSAP timeline
- `center: true` - centra el slide activo
- `onChange(el, index)` - callback cuando cambia el slide
- `toIndex(i)`, `next()`, `previous()` - navegación
- `closestIndex()` - índice del slide más cercano al centro

## Flujo mobile

1. El mismo `horizontalLoop` se usa en desktop y mobile
2. En mobile, `slider__main` tiene `position: relative` (diferente a desktop que es `absolute`)
3. Los slides tienen `width: 85vw` en mobile
4. El overlay con PROJECTS/01/05 está oculto en desktop (`hidden lg:flex`), en mobile se muestra el header arriba y 01/05 + flechas abajo
5. Los botones `data-slider-prev` y `data-slider-next` están duplicados (uno en overlay desktop, otro en bloque mobile) pero ambos usan los mismos selectores, así que los eventos se adjuntan a ambos
6. `activeProjectIndex` viene del `onChange` del loop y controla qué info se muestra abajo

## Posibles problemas en mobile

- El `horizontalLoop` con `center: true` usa el `container` (parent de los slides = slider__wrap) para calcular el centro. En mobile la estructura puede dar dimensiones diferentes.
- Los slides en mobile pueden no centrarse bien porque el loop está diseñado para vista horizontal con múltiples slides visibles.
- Para mobile podrías considerar un carousel diferente (p. ej. scroll-snap con un slide a la vez) en lugar del horizontalLoop.
