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
