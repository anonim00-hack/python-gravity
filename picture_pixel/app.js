const cols = 10;
const rows = 10;
const size = 20;
const els = [];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

let mouseDown = false;
let exploded = false; // состояние: разлетелись ли кубики
let followSpeed = 0.8;

// события мыши
document.addEventListener('mousedown', (e) => {
  mouseDown = true;
  exploded = false;
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
  exploded = true;

  // задаем случайные точки для каждого кубика
  els.forEach(obj => {
    obj.targetX = Math.random() * window.innerWidth;
    obj.targetY = Math.random() * window.innerHeight;
  });
});

document.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

// создаем кубики
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const el = document.createElement('div');
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.background = 'red';
    el.style.position = 'absolute';
    document.body.appendChild(el);

    els.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      offsetX: (x - cols / 2) * size,
      offsetY: (y - rows / 2) * size,
      speed: 0.01 + Math.random() * 0.03,
      targetX: 0,
      targetY: 0
    });
  }
}

// анимация
let interval = setInterval(() => {
  centerX += (mouseX - centerX) * followSpeed;
  centerY += (mouseY - centerY) * followSpeed;

  els.forEach(obj => {
    const { el, offsetX, offsetY, speed } = obj;

    // если не разлетелись — тянемся к центру
    let targetX = exploded ? obj.targetX : centerX + offsetX;
    let targetY = exploded ? obj.targetY : centerY + offsetY;

    obj.x += (targetX - obj.x) * speed;
    obj.y += (targetY - obj.y) * speed;

    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
  });
}, 16);

// остановка по нажатию X
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'x') {
    clearInterval(interval);
  }
});
