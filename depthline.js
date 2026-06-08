function updateScrollDepth() {
  const depthLine = document.getElementById("depth-line");
  const scrollY = window.scrollY || window.pageYOffset;

  depthLine.innerHTML = Math.floor(scrollY / 16.5) + " Meters Deep";
}

// Run on scroll
window.addEventListener("scroll", updateScrollDepth);

// Run once on load to initialize at 0
window.addEventListener("load", updateScrollDepth);
