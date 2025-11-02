import pygame
import random
import math

# Инициализация
pygame.init()
screen = pygame.display.set_mode((900, 700))
pygame.display.set_caption("Реалистичная Чёрная Дыра 🌌")

# Цвета
BLACK = (5, 5, 15)
YELLOW = (255, 220, 100)
BLUE = (120, 200, 255)
PURPLE = (180, 120, 255)

clock = pygame.time.Clock()
active = True

# Константы
NUM_PARTICLES = 300
GRAVITY_FORCE = 8000       # сила притяжения
FRICTION = 0.985           # трение (меньше = дольше скольжение)
SPIN_INTENSITY = 0.2       # сила орбитального вращения
MAX_SPEED = 30
BLUR = 40

# Частицы
particles = []
for _ in range(NUM_PARTICLES):
    p = {
        "x": random.uniform(0, 900),
        "y": random.uniform(0, 700),
        "vx": random.uniform(-2, 2),
        "vy": random.uniform(-2, 2),
        "color": (
            random.randint(100, 255),
            random.randint(100, 255),
            random.randint(150, 255)
        )
    }
    particles.append(p)

# Магниты / чёрные дыры
magnets = []
mouse_down = False


def create_p():
    """Создаёт несколько новых частиц возле курсора"""
    mx, my = pygame.mouse.get_pos()
    for _ in range(5):
        p = {
            "x": mx + random.uniform(-10, 10),
            "y": my + random.uniform(-10, 10),
            "vx": random.uniform(-2, 2),
            "vy": random.uniform(-2, 2),
            "color": (
                random.randint(100, 255),
                random.randint(100, 255),
                random.randint(150, 255)
            )
        }
        particles.append(p)


# Основной цикл
while active:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            active = False

        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                # Левая кнопка мыши — создать чёрную дыру
                mx, my = pygame.mouse.get_pos()
                magnets.append({
                    "x": mx,
                    "y": my,
                    "radius": 25,
                    "spin_dir": random.choice([-1, 1])  # направление вращения
                })
            elif event.button == 3:
                # Правая кнопка мыши — создание частиц
                mouse_down = True

        elif event.type == pygame.MOUSEBUTTONUP:
            mouse_down = False

        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1:
                GRAVITY_FORCE += 500
            elif event.key == pygame.K_2:
                GRAVITY_FORCE -= 500
            elif event.key == pygame.K_4:
                GRAVITY_FORCE += 20000
            elif event.key == pygame.K_5:
                GRAVITY_FORCE -= 20000
            elif event.key == pygame.K_q:
                SPIN_INTENSITY += 0.2
            elif event.key == pygame.K_w:
                SPIN_INTENSITY -= 0.2
            elif event.key == pygame.K_a:
                BLUR += 10
            elif event.key == pygame.K_s:
                BLUR -= 10
            elif event.key == pygame.K_r:
                particles = []
                magnets = []

    # Создание частиц при удержании ПКМ
    if mouse_down:
        create_p()

    # Полупрозрачная заливка для красивых следов
    overlay = pygame.Surface((900, 700), pygame.SRCALPHA)
    overlay.fill((0, 0, 0, BLUR))
    screen.blit(overlay, (0, 0))

    # === Обновление частиц ===
    for p in particles:
        ax, ay = 0, 0
        for m in magnets:
            dx = m["x"] - p["x"]
            dy = m["y"] - p["y"]
            dist_sq = dx * dx + dy * dy
            if dist_sq < 5:
                dist_sq = 5

            dist = math.sqrt(dist_sq)

            # Гравитационная сила (притяжение)
            gravity = GRAVITY_FORCE / dist_sq
            if gravity > 2:
                gravity = 2

            # Направление к центру
            nx = dx / dist
            ny = dy / dist

            # Орбитальная составляющая (повернута на 90°)
            tx = -ny * m["spin_dir"]
            ty = nx * m["spin_dir"]

            # Чем ближе — тем сильнее закручивание
            spin = SPIN_INTENSITY * (1 / (1 + dist / 100))

            # Итоговое ускорение — смесь притяжения и вращения
            ax += (nx + tx * spin) * gravity
            ay += (ny + ty * spin) * gravity

        # Обновляем физику
        p["vx"] += ax
        p["vy"] += ay

        # Трение
        p["vx"] *= FRICTION
        p["vy"] *= FRICTION

        # Ограничение скорости
        spd = math.sqrt(p["vx"] ** 2 + p["vy"] ** 2)
        if spd > MAX_SPEED:
            p["vx"] *= MAX_SPEED / spd
            p["vy"] *= MAX_SPEED / spd

        # Перемещаем частицу
        p["x"] += p["vx"]
        p["y"] += p["vy"]

        # Отскоки от стен
        if p["x"] < 0 or p["x"] > 900:
            p["vx"] *= -0.6
        if p["y"] < 0 or p["y"] > 700:
            p["vy"] *= -0.6

        # Рисуем частицу
        pygame.draw.circle(screen, p["color"], (int(p["x"]), int(p["y"])), 2)

    # === Отрисовка чёрных дыр ===
    for m in magnets:
        # Вращающееся свечение
        for i in range(8):
            angle = pygame.time.get_ticks() / 400 + i * math.pi / 4 * m["spin_dir"]
            x = m["x"] + math.cos(angle) * (m["radius"] + 10)
            y = m["y"] + math.sin(angle) * (m["radius"] + 10)
            color = (
                120 + int(100 * math.sin(angle)),
                100 + int(100 * math.cos(angle)),
                255
            )
            pygame.draw.circle(screen, color, (int(x), int(y)), 3)

        # Центральное ядро
        pygame.draw.circle(screen, PURPLE, (int(m["x"]), int(m["y"])), 5)
        pygame.draw.circle(screen, YELLOW, (int(m["x"]), int(m["y"])), m["radius"], 1)

    # Обновляем экран
    pygame.display.update()
    clock.tick(60)

pygame.quit()
