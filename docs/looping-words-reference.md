# Código de Looping Words (Skills) - Referencia para buscar solución

## Problema
- En mobile los corchetes no están alineados con el texto (quedan más abajo)
- El efecto de loop no es seamless en mobile

## HTML (page.tsx)

```tsx
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
```

## CSS (globals.css)

```css
.looping-words {
  height: 2.7em;
  padding-left: 0.1em;
  padding-right: 0.1em;
  font-size: clamp(1.75rem, 5vw, 5em);
  font-weight: 700;
  line-height: 0.9;
  position: relative;
  color: #0a0a0a;
  width: 100%;
}

.looping-words__list {
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  flex-flow: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  position: relative;
}

.looping-words__item {
  margin: 0;
  padding: 0;
  list-style: none;
}

.looping-words__fade {
  pointer-events: none;
  background-image: linear-gradient(
    #f5f5f5 5%,
    rgba(245, 245, 245, 0) 40%,
    rgba(245, 245, 245, 0) 60%,
    #f5f5f5 95%
  );
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.looping-words__edge {
  border-top: 0.035em solid #d8b4fe;
  border-left: 0.035em solid #d8b4fe;
  width: 0.125em;
  height: 0.125em;
  position: absolute;
  top: 0;
  left: 0;
}

.looping-words__edge.is--2 {
  left: auto;
  right: 0;
  transform: rotate(90deg);
}

.looping-words__edge.is--3 {
  inset: auto 0 0 auto;
  transform: rotate(180deg);
}

.looping-words__edge.is--4 {
  top: auto;
  bottom: 0;
  transform: rotate(270deg);
}

.looping-words__selector {
  pointer-events: none;
  width: 100%;
  height: 0.9em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.looping-words__containers {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.looping-words__p {
  margin: 0;
}

@media screen and (max-width: 768px) {
  .looping-words {
    height: 2.7em;
    font-size: clamp(1.5rem, 8vw, 2.75rem);
    max-width: 100%;
  }
  .looping-words__containers { min-width: 100%; }
  .looping-words__list { min-width: max-content; align-items: center; }
  .looping-words__p { padding: 0 0.5rem; }
  .looping-words__selector { height: 0.9em; }
  .looping-words__edge {
    border-top-width: 0.05em;
    border-left-width: 0.05em;
    width: 0.2em;
    height: 0.2em;
  }
}
```

## JavaScript (page.tsx - useEffect)

```javascript
useEffect(() => {
  const wordList = document.querySelector("[data-looping-words-list]");
  const edgeElement = document.querySelector("[data-looping-words-selector]");
  if (!wordList || !edgeElement) return;

  const words = Array.from(wordList.children);
  const totalWords = words.length;
  if (totalWords === 0) return;

  const wordHeight = 100 / totalWords;
  let currentIndex = 0;

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

  const updateEdgeWidth = () => {
    const centerIndex = (currentIndex + 1) % totalWords;
    const centerWord = words[centerIndex];
    const centerWordWidth = centerWord.getBoundingClientRect().width;
    const listWidth = wordList.getBoundingClientRect().width;
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
      duration: isMobile() ? 1.4 : 1.2,
      ease: isMobile() ? "power2.inOut" : "elastic.out(1, 0.85)",
      onStart: updateEdgeWidth,
      onComplete: () => {
        if (currentIndex >= totalWords - 3) {
          wordList.appendChild(wordList.children[0]);
          currentIndex--;
          gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
          words.push(words.shift());
        }
      },
    });
  };

  updateEdgeWidth();
  const tl = gsap.timeline({ repeat: -1, delay: 1 });
  tl.call(moveWords).to({}, { duration: 2 }).repeat(-1);
  return () => { tl.kill(); };
}, []);
```

## Demo de referencia
https://www.osmo.supply/demo/looping-words-with-selector
