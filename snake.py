import pygame, random

# --- Настройки окна ---
W, H = 600, 400
pygame.init()
pygame.display.set_caption('Snake')
screen = pygame.display.set_mode((W, H))
fps = pygame.time.Clock()

# --- Параметры игрока ---
px, py = 0, 0
pw, ph = 50, 50
direction = None  # Вместо 4 булевых переменных

# --- Игровая логика ---
time = 0
allow = False
t = 50

trail_positions = []
max_trail_length = 1
score = 0

# --- Еда ---
randomx = random.randrange(0, W - 20, 50)
randomy = random.randrange(0, H - 20, 50)

# --- Шрифты ---
font = pygame.font.SysFont('consolas', 40)

# --- Цвета ---
RED = (255, 0, 0)
GREEN = (0, 255, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

run = True
while run:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_d and direction != 'LEFT':
                direction = 'RIGHT'
            elif event.key == pygame.K_a and direction != 'RIGHT':
                direction = 'LEFT'
            elif event.key == pygame.K_w and direction != 'DOWN':
                direction = 'UP'
            elif event.key == pygame.K_s and direction != 'UP':
                direction = 'DOWN'
            elif event.key == pygame.K_1:
                t = max(5, t - 5)  # ограничим минимальное значение
            elif event.key == pygame.K_2:
                t += 5

    # --- Таймер движения ---
    if time < t:
        time += 1
        allow = False
    else:
        time = 0
        allow = True

    # --- Рендер счёта ---
    score_text = font.render(str(score), True, WHITE)

    # --- Проверка столкновения с едой ---
    player_rect = pygame.Rect(px, py, pw, ph)
    food_rect = pygame.Rect(randomx, randomy, 20, 20)

    if player_rect.colliderect(food_rect):
        score += 1
        max_trail_length += 1
        randomx = random.randrange(0, W - 20, 50)
        randomy = random.randrange(0, H - 20, 50)

    # --- Обновление хвоста ---
    if allow and direction:
        trail_positions.append((px, py))
        if len(trail_positions) > max_trail_length:
            trail_positions.pop(0)

    # --- Движение игрока ---
    if allow:
        if direction == 'RIGHT' and px < W - pw:
            px += pw
        elif direction == 'LEFT' and px > 0:
            px -= pw
        elif direction == 'UP' and py > 0:
            py -= ph
        elif direction == 'DOWN' and py < H - ph:
            py += ph

    # --- Проверка на столкновение с собой ---
    for (tx, ty) in trail_positions[:-1]:
        if px == tx and py == ty:
            run = False  # Конец игры

    # --- Отрисовка ---
    screen.fill(BLACK)

    # Отрисовка хвоста
    for i, (trail_x, trail_y) in enumerate(trail_positions):
        white_intensity = max(50, min(255, 255 - (len(trail_positions) - i) * 10))
        trail_color = (white_intensity, 50, 50)
        pygame.draw.rect(screen, trail_color, (trail_x, trail_y, pw, ph))

    # Игрок
    pygame.draw.rect(screen, RED, (px, py, pw, ph))

    # Еда
    pygame.draw.rect(screen, GREEN, (randomx, randomy, 20, 20))

    # Счёт
    screen.blit(score_text, (W - 80, 10))

    pygame.display.update()
    fps.tick(60)

pygame.quit()
