function updateScrollDepth() {
  const depthLine = document.getElementById("depth-line");
  const scrollY = window.scrollY || window.pageYOffset;

  const fadeStart = window.innerHeight * 0.25; // 25% of start section
  const lineOffset = window.innerHeight * 0.18;

  if (scrollY < fadeStart) {
    depthLine.style.opacity = 0;
  } else {
    depthLine.style.opacity = 1;
    depthLine.innerHTML =
      Math.floor(Math.round((scrollY - lineOffset) / 16.5) - 2) +
      " Meters Deep";
  }
}

// Run on scroll
window.addEventListener("scroll", updateScrollDepth);

// Run once on load to initialize at 0
window.addEventListener("load", updateScrollDepth);
