const MIN_LOADING_TIME = 1000;
const start = Date.now();

window.addEventListener("load", () => {
  const elapsed = Date.now() - start;
  const delay = Math.max(0, MIN_LOADING_TIME - elapsed);

  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    if (preloader) preloader.style.display = "none";
    if (content) content.style.display = "block";

    // Zavolaj inicializáciu po zobrazení obsahu
    requestAnimationFrame(() => {
      initializeApp();
    });

  }, delay);
});

function initializeApp() {
  // Vyber elementy až po zobrazení obsahu
  const screens = document.querySelectorAll(".content");
  let currentScreen = 0;
  let isScrolling = false;

  const continueText = document.getElementById('continue-text');
  if (continueText) {
    setTimeout(() => {
      continueText.classList.add('show');
    }, 4000);
  }

  screens.forEach((screen, i) => {
    gsap.set(screen, {
      opacity: i === 0 ? 1 : 0,
      pointerEvents: i === 0 ? 'auto' : 'none'
    });
  });

  function showScreen(index) {
    screens.forEach((screen, i) => {
      gsap.to(screen, {
        opacity: i === index ? 1 : 0,
        pointerEvents: i === index ? 'auto' : 'none',
        duration: 0.8
      });
    });
  }

  window.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0) {
      currentScreen = Math.min(currentScreen + 1, screens.length - 1);
    } else {
      currentScreen = Math.max(currentScreen - 1, 0);
    }

    showScreen(currentScreen);
    setTimeout(() => isScrolling = false, 800);
  });

  window.addEventListener("click", () => {
    if (isScrolling) return;
    isScrolling = true;

    currentScreen = Math.min(currentScreen + 1, screens.length - 1);
    showScreen(currentScreen);
    setTimeout(() => isScrolling = false, 800);
  });

  const parallax_el = document.querySelectorAll(".parallax");
  let xValue = 0, yValue = 0, rotateDegree = 0;

  function update(cursorX) {
    parallax_el.forEach((el) => {
      const speedx = +el.dataset.speedx;
      const speedy = +el.dataset.speedy;
      const speedz = +el.dataset.speedz;
      const rotateSpeed = +el.dataset.rotation;

      const isInLeft = parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
      const zValue = (cursorX - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.15;

      el.style.transform = `
        perspective(1200px)
        translateZ(${zValue * speedz}px)
        rotateY(${rotateDegree * rotateSpeed}deg)
        translateX(calc(-50% + ${-xValue * speedx}px))
        translateY(calc(-50% + ${-yValue * speedy}px))
      `;
    });
  }

  window.addEventListener("mousemove", (e) => {
    if (timeline.isActive()) return;

    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

    update(e.clientX);
  });

  let timeline = gsap.timeline();

  Array.from(parallax_el)
    .filter(el => !el.classList.contains("text"))
    .forEach(el => {
      const distance = parseFloat(el.dataset.distance);
      timeline.from(el, {
        top: `${el.offsetHeight / 2 + distance}px`,
        duration: 2.5,
        ease: "power3.out",
      }, "1 ");
    });

  timeline.from(".text h1", {
    y: window.innerHeight - document.querySelector(".text h1").getBoundingClientRect().top,
    duration: 2,
  }, "2.5").from(".text h2", {
    y: -150,
    opacity: 0,
    duration: 1.5,
  }, "2");
}
