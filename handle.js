const present = document.querySelector(".present");
const image = document.querySelector(".image");
const container = document.querySelector(".container");

// Setup canvas, drawing functions
const colors = ["#D8589F", "#EE4523", "#FBE75D", "#4FC5DF"];
const bubbles = 80;

const explode = (x, y) => {
  let particles = [];
  let ratio = window.devicePixelRatio;
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");

  c.style.position = "absolute";
  // Center the canvas around the (x, y) position
  c.style.left = x - 250 + "px"; // 500px width / 2
  c.style.top = y - 250 + "px"; // 500px height / 2
  c.style.pointerEvents = "none";
  c.style.width = "500px";
  c.style.height = "500px";
  c.style.zIndex = 9999;
  c.width = 500 * ratio;
  c.height = 500 * ratio;
  document.body.appendChild(c);

  // Create particles
  for (let i = 0; i < bubbles; i++) {
    particles.push({
      x: c.width / 2, // Center particles in the canvas
      y: c.height / 2,
      radius: r(3, 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: r(230, 310, true),
      speed: r(3, 7),
      friction: 0.99,
      fade: 0.03,
      opacity: r(150, 150, true),
      yVel: 0,
      gravity: 0.06,
    });
  }

  // Render particles
  render(particles, ctx, c.width, c.height);
  // Remove the canvas after 5 seconds
  setTimeout(() => document.body.removeChild(c), 5000);
};

const render = (particles, ctx, width, height) => {
  requestAnimationFrame(() => render(particles, ctx, width, height));
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180);
    p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180);

    p.opacity -= 0.005;
    p.speed *= p.friction;
    p.radius -= p.fade;
    p.yVel += p.gravity;
    p.y += p.yVel;

    if (p.opacity < 0 || p.radius < 0) return;

    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });

  return ctx;
};

const r = (a, b, c) =>
  parseFloat(
    (Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(
      c ? c : 0
    )
  );

// Explode on hover over the image
image.addEventListener("mouseover", (e) => {
  const rect = image.getBoundingClientRect();
  const x = rect.left + rect.width / 2; // Center horizontally
  const y = rect.top + rect.height / 2; // Center vertically
  explode(x, y);
});

// Explode on click of the present
present.onclick = () => {
  present.classList.toggle("open");
  container.classList.toggle("container-open");

  const rect = present.getBoundingClientRect();
  const x = rect.left + rect.width / 2; // Center horizontally
  const y = rect.top + rect.height / 2; // Center vertically
  explode(x, y);
};

// Zoom in/out container on click
container.onclick = () => {
  container.classList.toggle("image-zoomed");
};
