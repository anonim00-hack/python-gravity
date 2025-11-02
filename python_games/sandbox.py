import pygame
pygame.init()

# Настройки
screen = pygame.display.set_mode((600, 400))
fps = pygame.time.Clock()
active = True

size = 5
cols = 120
rows = 80
fall_delay = 0.1

# Список всех клеток
elements = []
for row in range(rows):
    for col in range(cols):
        rect = pygame.Rect(size * col, size * row, size, size)
        elements.append({
            "rect": rect,
            "color": 'blue',
            "row": row,
            "col": col,
            "is_sand": False,
            "is_water": False,
            "fall_timer": 0
        })

def get_element(row, col):
    if 0 <= row < rows and 0 <= col < cols:
        return elements[row * cols + col]
    return None

mouse_down = False
mode = "sand"  # "sand" или "water"

def place_particle():
    mouse_pos = pygame.mouse.get_pos()
    for el in elements:
        if el["rect"].collidepoint(mouse_pos):
            if mode == "sand":
                el["is_sand"] = True
                el["is_water"] = False
                el["color"] = 'yellow'
            elif mode == "water":
                el["is_water"] = True
                el["is_sand"] = False
                el["color"] = 'cyan'

while active:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            active = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mouse_down = True
        elif event.type == pygame.MOUSEBUTTONUP:
            mouse_down = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r:
                for el in elements:
                    el["is_sand"] = False
                    el["is_water"] = False
                    el["color"] = 'blue'
            elif event.key == pygame.K_s:
                mode = "sand"
            elif event.key == pygame.K_w:
                mode = "water"

    if mouse_down:
        place_particle()

    # Обновляем физику
    for row in range(rows - 1, -1, -1):
        for col in range(cols):
            el = get_element(row, col)
            if el["is_sand"]:
                below = get_element(row + 1, col)
                bottom_left = get_element(row + 1, col - 1)
                bottom_right = get_element(row + 1, col + 1)

                if below and not (below["is_sand"]):
                    below["is_sand"] = True
                    below["is_water"] = False
                    below["color"] = 'yellow'
                    el["is_sand"] = False
                    el["color"] = 'blue'
                elif bottom_left and not (bottom_left["is_sand"]):
                    bottom_left["is_sand"] = True
                    bottom_left["color"] = 'yellow'
                    el["is_sand"] = False
                    el["color"] = 'blue'
                elif bottom_right and not (bottom_right["is_sand"]):
                    bottom_right["is_sand"] = True
                    bottom_right["color"] = 'yellow'
                    el["is_sand"] = False
                    el["color"] = 'blue'

            elif el["is_water"]:
                below = get_element(row + 1, col)
                left = get_element(row, col - 1)
                right = get_element(row, col + 1)
                bottom_left = get_element(row + 1, col - 1)
                bottom_right = get_element(row + 1, col + 1)

                moved = False
                if below and not (below["is_sand"] or below["is_water"]):
                    below["is_water"] = True
                    below["color"] = 'cyan'
                    el["is_water"] = False
                    el["color"] = 'blue'
                    moved = True
                elif bottom_left and not (bottom_left["is_sand"] or bottom_left["is_water"]):
                    bottom_left["is_water"] = True
                    bottom_left["color"] = 'cyan'
                    el["is_water"] = False
                    el["color"] = 'blue'
                    moved = True
                elif bottom_right and not (bottom_right["is_sand"] or bottom_right["is_water"]):
                    bottom_right["is_water"] = True
                    bottom_right["color"] = 'cyan'
                    el["is_water"] = False
                    el["color"] = 'blue'
                    moved = True
                elif not moved:
                    import random
                    if random.random() < 0.5:
                        side = left
                    else:
                        side = right
                    if side and not (side["is_sand"] or side["is_water"]):
                        side["is_water"] = True
                        side["color"] = 'cyan'
                        el["is_water"] = False
                        el["color"] = 'blue'

    # Отрисовка
    screen.fill((0, 0, 0))
    for el in elements:
        pygame.draw.rect(screen, el["color"], el["rect"])
        pygame.draw.rect(screen, (20, 20, 20), el["rect"], 1)

    pygame.display.update()
    fps.tick(60)

pygame.quit()
