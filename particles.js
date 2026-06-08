function createParticleSystem({
  containerId = "particle-layer",
  ratePerSecond = 3,
  minSize = 4,
  maxSize = 16,
  colors = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6", "#fb923c", "#facc15"],
  minLife = 10_000,
  maxLife = 30_000,
  viewportPad = 100,
} = {}) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`#${containerId} not found`);

  let spawnZone = { top: 0, left: 0, width: 0, height: 0 };
  let intervalId = null;
  let destroyed = false;
  const particles = new Set();

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }
  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function updateSpawnZone() {
    const rect = container.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // visible portion of the container relative to its own coordinate space
    const visTop = Math.max(0, -rect.top) - viewportPad;
    const visLeft = Math.max(0, -rect.left) - viewportPad;
    const visBottom = Math.min(
      container.scrollHeight,
      visTop + window.innerHeight + viewportPad * 2,
    );
    const visRight = Math.min(
      container.scrollWidth,
      visLeft + window.innerWidth + viewportPad * 2,
    );

    spawnZone = {
      top: Math.max(0, visTop),
      left: Math.max(0, visLeft),
      width: Math.max(0, visRight - visLeft),
      height: Math.max(0, visBottom - visTop),
    };
  }

  function spawnParticle() {
    if (destroyed) return;
    updateSpawnZone();
    if (spawnZone.width === 0 || spawnZone.height === 0) return;

    const size = rand(minSize, maxSize);

    const life = rand(minLife, maxLife);
    const color = colors[randInt(0, colors.length - 1)];
    const x = spawnZone.left + Math.random() * spawnZone.width;
    const y = spawnZone.top + Math.random() * spawnZone.height;
    const peakOp = rand(0.25, 0.75).toFixed(2);
    const drift = () => (Math.random() - 0.5) * 40;

    const GLOW_THRESHOLD = 13200;

    const pastGlowDepth = window.scrollY > GLOW_THRESHOLD;
    const isFlicker = pastGlowDepth && Math.random() < 0.15;

    const el = document.createElement("div");
    el.className = "particle" + (isFlicker ? " particle--flicker" : "");
    el.style.cssText = [
      `width:${size}px`,
      `height:${size}px`, // squish height for elongated
      `left:${x}px`,
      `top:${y}px`,
      `background:${color}`,
      `border-radius:100`,
      `--duration:${(life / 1000).toFixed(1)}s`,
      `--peak-opacity:${peakOp}`,
      `--dx0:${drift()}px`,
      `--dy0:${drift()}px`,
      `--dx1:${drift()}px`,
      `--dy1:${drift()}px`,
      `--dx2:${drift()}px`,
      `--dy2:${drift()}px`,
      isFlicker ? `--glow-color:${color}` : "",
    ].join(";");

    container.appendChild(el);
    particles.add(el);

    const timeoutId = setTimeout(() => {
      el.remove();
      particles.delete(el);
    }, life + 50);

    el._timeoutId = timeoutId;
  }

  function startSpawning() {
    if (intervalId) clearInterval(intervalId);
    const delay = Math.max(50, 1000 / ratePerSecond);
    intervalId = setInterval(spawnParticle, delay);
  }

  updateSpawnZone();
  startSpawning();
  window.addEventListener("scroll", updateSpawnZone, { passive: true });
  window.addEventListener("resize", updateSpawnZone, { passive: true });

  return {
    stop() {
      destroyed = true;
      clearInterval(intervalId);
      window.removeEventListener("scroll", updateSpawnZone);
      window.removeEventListener("resize", updateSpawnZone);
      particles.forEach((el) => {
        clearTimeout(el._timeoutId);
        el.remove();
      });
      particles.clear();
    },
    setRate(r) {
      ratePerSecond = r;
      startSpawning();
    },
  };
}

const farSystem = createParticleSystem({
  containerId: "particle-container-far",
  ratePerSecond: 4,
  minSize: 1,
  maxSize: 3,
  minLife: 10_000,
  maxLife: 30_000,
  colors: ["#ffffff"],
  viewportPad: 100,
});

const nearSystem = createParticleSystem({
  containerId: "particle-container-near",
  ratePerSecond: 3,
  minSize: 1,
  maxSize: 5,
  minLife: 10_000,
  maxLife: 30_000,
  colors: ["#ffffff"],
  viewportPad: 100,
});

const farContainer = document.getElementById("particle-container-far");
const PARALLAX_FACTOR = 0.1;
let farOffset = 0;
let lastScrollY = window.scrollY;

window.addEventListener(
  "scroll",
  () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    farOffset -= delta * (1 - PARALLAX_FACTOR);
    farContainer.style.transform = `translateY(${farOffset}px)`;
  },
  { passive: true },
);
