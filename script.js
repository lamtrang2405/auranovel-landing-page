(() => {
  function init() {
    const root = document.querySelector(".carousel");
    if (!root) return;

    const track = root.querySelector(".carousel-track");
    const items = Array.from(root.querySelectorAll(".carousel-item"));

    if (!track || items.length < 3) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Center index (highlighted cover)
    let active = 0;
    let timer = null;
    let isAnimating = false;

    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    function setPos() {
      const n = items.length;
      for (let i = 0; i < n; i++) {
        // Relative position around the circle: -2,-1,0,1,2 (with wrapping)
        let d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;

        // Only 5 visible slots (-2..2). Anything else is hidden.
        const el = items[i];
        if (d < -2 || d > 2) {
          el.dataset.pos = "far";
          el.setAttribute("aria-hidden", "true");
          el.tabIndex = -1;
          continue;
        }

        el.dataset.pos = String(d);
        el.setAttribute("aria-hidden", d === 0 ? "false" : "true");
        el.tabIndex = d === 0 ? 0 : -1;
      }
    }

    function step(dir) {
      if (isAnimating) return;
      isAnimating = true;

      active = mod(active + dir, items.length);
      setPos();

      // Allow CSS transitions to finish before next action
      window.setTimeout(() => {
        isAnimating = false;
      }, prefersReduced ? 0 : 720);
    }

    function start() {
      if (prefersReduced) return;
      stop();
      timer = window.setInterval(() => step(1), 1000);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    // Keyboard support (optional, keeps auto-slide running)
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    });

    // Init
    setPos();
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

