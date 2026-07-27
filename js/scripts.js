const words = ["ВЫБОР", "ПУТЬ", "УЮТ", "МЫ"];

const changingWord = document.querySelector("#changingWord");

let currentIndex = 0;
let isAnimating = false;

function createWordLayer(word, className) {
  const layer = document.createElement("div");

  layer.className = `word-layer ${className}`;

  [...word].forEach((character) => {
    const mask = document.createElement("span");
    const letter = document.createElement("span");

    mask.className = "letter-mask";
    letter.className = "letter";
    letter.textContent = character;

    mask.appendChild(letter);
    layer.appendChild(mask);
  });

  return layer;
}

function renderInitialWord() {
  changingWord.innerHTML = "";

  const firstLayer = createWordLayer(words[currentIndex], "word-layer-current");

  changingWord.appendChild(firstLayer);
}

function changeWord() {
  if (isAnimating) return;

  isAnimating = true;

  const currentLayer = changingWord.querySelector(".word-layer-current");

  const nextIndex = (currentIndex + 1) % words.length;

  const nextLayer = createWordLayer(words[nextIndex], "word-layer-next");

  changingWord.appendChild(nextLayer);

  const currentLetters = currentLayer.querySelectorAll(".letter");
  const nextLetters = nextLayer.querySelectorAll(".letter");

  gsap.set(nextLetters, {
    yPercent: 115,
    rotationX: -15,
  });

  const timeline = gsap.timeline({
    onComplete() {
      currentLayer.remove();

      nextLayer.classList.remove("word-layer-next");
      nextLayer.classList.add("word-layer-current");

      gsap.set(nextLetters, {
        clearProps: "transform",
      });

      currentIndex = nextIndex;
      isAnimating = false;
    },
  });

  timeline.to(currentLetters, {
    yPercent: -115,
    rotationX: 15,
    duration: 1,
    stagger: {
      each: 0.05,
      from: "start",
    },
    ease: "power2.inOut",
  });

  timeline.to(
    nextLetters,
    {
      yPercent: 0,
      rotationX: 0,
      duration: 1,
      stagger: {
        each: 0.05,
        from: "start",
      },
      ease: "power2.inOut",
    },
    0.08,
  );
}

function startLoop() {
  gsap.delayedCall(2.5, function repeat() {
    changeWord();
    gsap.delayedCall(2.5, repeat);
  });
}

renderInitialWord();
startLoop();

/* timer */

const targetDate = new Date("2026-09-26T15:00:00");

function updateTimer() {
  const now = new Date();

  const diff = targetDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById("days").textContent = String(days).padStart(2, "0");

  document.getElementById("hours").textContent = String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );
}

updateTimer();
setInterval(updateTimer, 1000);

/* gallery */

const gallery = document.querySelector(".gallery");
const track = document.querySelector(".gallery-track");

gsap.to(track, {
  x: () => -(track.scrollWidth - gallery.offsetWidth),
  ease: "none",
  scrollTrigger: {
    trigger: gallery,
    start: "top top",
    end: () => `+=${track.scrollWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});
