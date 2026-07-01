//............................................................... Script ...................................................................
// Preloader Logic
let loadPercentage = 0;
let currentImageIndex = 0;

const preloaderInterval = setInterval(() => {
  const preloader = document.getElementById('preloader');
  const loadingText = document.querySelector('.loading-text');
  const preloaderImages = document.querySelectorAll('.preloader-images img');

  if (!preloader || !loadingText || preloaderImages.length === 0) return;

  if (loadPercentage < 95) {
    loadPercentage += Math.floor(Math.random() * 5) + 1;
    if (loadPercentage > 95) loadPercentage = 95;
    loadingText.textContent = `${loadPercentage}%`;
  }
  
  preloaderImages.forEach((img, index) => {
    if (index === currentImageIndex) {
      img.classList.add('active');
    } else {
      img.classList.remove('active');
    }
  });
  
  currentImageIndex = (currentImageIndex + 1) % preloaderImages.length;
}, 150);

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const loadingText = document.querySelector('.loading-text');
  
  if (!preloader) return;

  let finishInterval = setInterval(() => {
    loadPercentage += 2;
    if (loadPercentage >= 100) {
      loadPercentage = 100;
      if (loadingText) loadingText.textContent = `100%`;
      clearInterval(finishInterval);
      clearInterval(preloaderInterval);
      
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    } else {
      if (loadingText) loadingText.textContent = `${loadPercentage}%`;
    }
  }, 30);
});

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
      const response = await fetch(`./src/assets/Tin/${filename}`);
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

//// get the elements
const waveEffect = document.querySelector(".wave");
const sections = document.querySelectorAll(".section");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const caneLabels = document.querySelector(".cane-labels");
const sectionContainer = document.querySelector(".section-container");

// Clone first elements for seamless loop
const firstLabelClone = caneLabels.children[0].cloneNode(true);
caneLabels.appendChild(firstLabelClone);

const firstSectionClone = sectionContainer.children[0].cloneNode(true);
sectionContainer.appendChild(firstSectionClone);

// Update widths to accommodate the 6th cloned item
caneLabels.style.setProperty('width', '600%', 'important');
Array.from(caneLabels.children).forEach(img => {
  img.style.setProperty('width', 'calc(100% / 6)', 'important');
  img.style.setProperty('object-fit', 'cover', 'important');
  img.style.setProperty('transform', 'scale(1.04)', 'important');
  img.style.setProperty('clip-path', 'inset(0 2%)', 'important');
});
sectionContainer.style.setProperty('width', '600vw', 'important');

// Set index and current position
let currentIndex = 0;
let currentPosition = 0;
let isAnimating = false;
const totalSlides = h1Texts.length; // 5

function goToNextSlide() {
  if (isAnimating) return;
  isAnimating = true;

  currentIndex++;
  currentPosition -= 100;
  
  caneLabels.style.transition = `all 0.3s ease-in-out`;
  sectionContainer.style.transition = `all 0.3s ease-in-out`;
  
  caneLabels.style.left = `${currentPosition}%`;
  sectionContainer.style.left = `${currentPosition}%`;

  let visualIndex = currentIndex % totalSlides;
  document.querySelector(".h1").innerHTML = h1Texts[visualIndex];
  gsap.fromTo(".h1", { y: "20%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1 });
  
  nextButton.style.color = logoColors[(visualIndex + 1) % totalSlides];
  nextButton.style.animationName = keyframes[(visualIndex + 1) % totalSlides];
  
  prevButton.style.display = "block";

  // If we reached the clone (index 5)
  if (currentIndex === totalSlides) {
    setTimeout(() => {
      // Instantly jump to the real first slide (index 0)
      caneLabels.style.transition = 'none';
      sectionContainer.style.transition = 'none';
      
      currentIndex = 0;
      currentPosition = 0;
      caneLabels.style.left = `0%`;
      sectionContainer.style.left = `0%`;
      
      isAnimating = false;
    }, 1000);
  } else {
    setTimeout(() => { isAnimating = false; }, 1000);
  }
}

// Add event listeners to the buttons
nextButton.addEventListener("click", goToNextSlide);

prevButton.addEventListener("click", () => {
  if (isAnimating) return;
  if (currentIndex === 0) return; // For simplicity, we won't infinite loop backwards
  
  isAnimating = true;
  currentIndex--;
  currentPosition += 100;
  
  caneLabels.style.transition = `all 0.3s ease-in-out`;
  sectionContainer.style.transition = `all 0.3s ease-in-out`;
  caneLabels.style.left = `${currentPosition}%`;
  sectionContainer.style.left = `${currentPosition}%`;

  let visualIndex = currentIndex % totalSlides;
  document.querySelector(".h1").innerHTML = h1Texts[visualIndex];
  gsap.fromTo(".h1", { y: "20%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1 });
  
  nextButton.style.color = logoColors[(visualIndex + 1) % totalSlides];
  nextButton.style.animationName = keyframes[(visualIndex + 1) % totalSlides];

  if (currentIndex === 0) {
    prevButton.style.display = "none";
  }
  
  setTimeout(() => { isAnimating = false; }, 1000);
});


// Section 2 Cards Logic
const cards = document.querySelectorAll(".cards-wrapper .card");
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

// Mouse parallax effect for background floating images has been disabled
// document.addEventListener("mousemove", (e) => {
//   const xOffset = (e.clientX / window.innerWidth - 0.5) * 30;
//   const yOffset = (e.clientY / window.innerHeight - 0.5) * 30;

//   sections.forEach((section) => {
//     // Shifting background position to create parallax effect
//     // We increase background size slightly so edges don't show when moving
//     if (!section.style.backgroundSize.includes('calc')) {
//       section.style.backgroundSize = 'calc(100% + 60px) calc(100% + 60px)';
//     }
//     section.style.backgroundPosition = `calc(50% + ${-xOffset}px) calc(50% + ${-yOffset}px)`;
//   });
// });

// Auto Slide Logic
setInterval(() => {
  goToNextSlide();
}, 1000);