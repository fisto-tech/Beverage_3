//............................................................... Script ...................................................................
document.addEventListener('DOMContentLoaded', async () => {
  const svgFiles = [
    'Berrybg.svg', 'Citrusbg.svg', 'Kiwibg.svg',
    'Litchbg.svg', 'Orangebg.svg'
  ];

  const styleStr = `
<style>
  [fill^="url(#pattern"] {
    animation: float 6s ease-in-out infinite;
    transform-origin: center;
  }
  [fill^="url(#pattern"]:nth-child(even) {
    animation-duration: 8s;
  }
  [fill^="url(#pattern"]:nth-child(3n) {
    animation-duration: 7s;
    animation-delay: -2s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
</style>
`;

  for (let i = 0; i < svgFiles.length; i++) {
    const filename = svgFiles[i];
    try {
      const response = await fetch(`./src/assets/${filename}`);
      let text = await response.text();

      // Inject style if not present
      if (!text.includes('<style>')) {
        text = text.replace(/(<svg[^>]*>)/i, '$1\n' + styleStr);
      }

      const blob = new Blob([text], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Update the background image for the corresponding section
      const section = document.getElementById(`section${i + 1}`);
      if (section) {
        section.style.background = `url("${url}") center/cover no-repeat`;
      }
    } catch (e) {
      console.error('Error modifying SVG:', e);
    }
  }
});

// Data for the sections
let h1Texts = ["Berry Blast", "Citrus Splash", "Kiwi Kick", "Lychee Fizz", "Orange Bursh"]; // Add your h1 texts here
let logoColors = [
  "var(--berry-logo)",
  "var(--citrus-logo)",
  "var(--kiwi-logo)",
  "var(--litchi-logo)",
  "var(--orange-logo)"
]; // Add your logo colors here
let keyframes = [
  "wave-berry-effect",
  "wave-citrus-effect",
  "wave-kiwi-effect",
  "wave-litchi-effect",
  "wave-orange-effect"
]; // Add your keyframes here

// get the elements
const waveEffect = document.querySelector(".wave");
const sections = document.querySelectorAll(".section");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const caneLabels = document.querySelector(".cane-labels");
const sectionContainer = document.querySelector(".section-container");
// Set index and current position
let index = 0;
let currentIndex = 0;
let currentPosition = 0;

// Add event listeners to the buttons
nextButton.addEventListener("click", () => {
  // Decrease the current position by 100% (to the left)
  if (currentPosition > -400) {
    currentPosition -= 100;
    // Update the left position of the cane-labels
    caneLabels.style.left = `${currentPosition}%`;
    sectionContainer.style.left = `${currentPosition}%`;
  }
  // Increment index and currentIndex
  currentIndex++;
  // Update the h1 text if currentIndex is less than the length of h1Texts
  if (currentIndex < h1Texts.length) {
    document.querySelector(".h1").innerHTML = h1Texts[currentIndex];
  }
  // Gasp animation for next section components
  // gsap.to(".logo", {
  //   opacity: 1,
  //   duration: 1,
  //   color: logoColors[currentIndex]
  // });
  gsap.from(".h1", { y: "20%", opacity: 0, duration: 0.5 });

  // Disable the nextButton if the last section is active
  if (currentIndex === h1Texts.length - 1) {
    nextButton.style.display = "none";
  }
  // Enable the prevButton if it's not the first section
  if (currentIndex > 0) {
    prevButton.style.display = "block";
  }
  // Button colors and animations
  nextButton.style.color = logoColors[currentIndex + 1];
  prevButton.style.color = logoColors[currentIndex - 1];
  nextButton.style.animationName = keyframes[currentIndex + 1];
  prevButton.style.animationName = keyframes[currentIndex - 1];
});
// Add event listeners to the buttons
prevButton.addEventListener("click", () => {
  if (currentPosition < 0) {
    currentPosition += 100;
    // Update the left position of the cane-labels
    caneLabels.style.left = `${currentPosition}%`;
    sectionContainer.style.left = `${currentPosition}%`;
    sectionContainer.style.transition = `all 0.5s ease-in-out`;
  }
  // Decrement index and currentIndex
  currentIndex--;
  if (currentIndex >= 0) {
    document.querySelector(".h1").innerHTML = h1Texts[currentIndex];
  }
  // Gasp animation for previous section components
  // gsap.to(".logo", { color: logoColors[currentIndex], duration: 1 });
  gsap.from(".h1", { y: "20%", opacity: 0, duration: 0.5 });
  // Enable the nextButton if it was disabled
  nextButton.style.display = "block";
  // Disable the prevButton if it's the first section
  if (currentIndex === 0) {
    prevButton.style.display = "none";
  }
  // Button colors and animations
  nextButton.style.color = logoColors[currentIndex + 1];
  prevButton.style.color = logoColors[currentIndex - 1];
  nextButton.style.animationName = keyframes[currentIndex + 1];
  prevButton.style.animationName = keyframes[currentIndex - 1];
});

// Mouse wheel scrolling logic
let isScrolling = false;

window.addEventListener("wheel", (e) => {
  // Prevent default scrolling behavior if needed
  // e.preventDefault();

  if (isScrolling) return;

  if (e.deltaY > 0) {
    // Scrolling down -> go to next section
    if (currentIndex < h1Texts.length - 1) {
      isScrolling = true;
      nextButton.click();
      setTimeout(() => { isScrolling = false; }, 1200); // 1.2s cooldown to prevent double-skipping
    }
  } else if (e.deltaY < 0) {
    // Scrolling up -> go to previous section
    if (currentIndex > 0) {
      isScrolling = true;
      prevButton.click();
      setTimeout(() => { isScrolling = false; }, 1200); // 1.2s cooldown to prevent double-skipping
    }
  }
}, { passive: false });

// Section 2 Cards Logic
const cards = document.querySelectorAll(".section-2 .card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    cards.forEach((c) => {
      if (c == card) c.classList.add("active");
      else c.classList.add("not-active");
    });
  });

  card.addEventListener("mouseleave", () => {
    cards.forEach((c) => {
      c.classList.remove("active", "not-active");
    });
  });
});

// Mouse parallax effect for background floating images
document.addEventListener("mousemove", (e) => {
  const xOffset = (e.clientX / window.innerWidth - 0.5) * 30;
  const yOffset = (e.clientY / window.innerHeight - 0.5) * 30;

  sections.forEach((section) => {
    // Shifting background position to create parallax effect
    // We increase background size slightly so edges don't show when moving
    if (!section.style.backgroundSize.includes('calc')) {
      section.style.backgroundSize = 'calc(100% + 60px) calc(100% + 60px)';
    }
    section.style.backgroundPosition = `calc(50% + ${-xOffset}px) calc(50% + ${-yOffset}px)`;
  });
});