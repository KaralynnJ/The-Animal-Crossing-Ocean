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

document.querySelectorAll(".creature-wrapper").forEach((wrapper) => {
  const reposition = () => {
    const desc = wrapper.querySelector(".description");
    desc.style.left = "50%";
    desc.style.transform = "translateX(-50%)";
    desc.style.right = "";

    const rect = desc.getBoundingClientRect();
    if (rect.left < 8) {
      desc.style.left = "0";
      desc.style.transform = "translateX(0)";
    } else if (rect.right > window.innerWidth - 8) {
      desc.style.left = "auto";
      desc.style.right = "0";
      desc.style.transform = "none";
    }
  };

  const reset = () => {
    const desc = wrapper.querySelector(".description");
    desc.style.left = "";
    desc.style.right = "";
    desc.style.transform = "";
  };

  wrapper.addEventListener("mouseenter", reposition);
  wrapper.addEventListener("mouseleave", reset);
  wrapper.addEventListener("touchstart", reposition, { passive: true });
});
