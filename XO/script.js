document.addEventListener('DOMContentLoaded', () => {
    const place = document.querySelector('.place')
    const playerX = document.querySelector('.playerX')
    const playerO = document.querySelector('.playerO')
    const blur = document.querySelector('.blur')
    const child_body=document.querySelector('.child_body')

    let playerIsX=true
    for (let i = 0; i < 9; i++) {
        const child = document.createElement('div')
        child.classList.add('cell')
        place.appendChild(child)
    }
    
    const childs = document.querySelectorAll('.cell')
    
    childs.forEach((el, index) => {
        el.addEventListener('click', () => {
            if (el.textContent == '' && !checkWin() && !isDraw()) {
                const symbol = playerIsX ? 'X' : 'O'
                el.textContent = symbol
                el.setAttribute('data-value', symbol)
                el.classList.add('filled')
                
                if (checkWin()) {
                    highlightWinningCells()
                    setTimeout(() => {
                    }, 500)
                } else if (isDraw()) {
                    setTimeout(() => {
                    }, 500)
                } else {
                    playerIsX = !playerIsX
                }

                if (symbol=='X'){
                    playerX.style.height='160px'
                    playerX.style.opacity='1'
                    playerO.style.height='80px'
                    playerO.style.opacity='0.5'
                }else{
                    playerX.style.height='80px'
                    playerX.style.opacity='0.5'
                    playerO.style.height='160px'
                    playerO.style.opacity='1'
                }
            }
        })
    })
    
    function checkWin() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        
        for (let combination of winningCombinations) {
            const [a, b, c] = combination
            if (childs[a].textContent !== '' && 
                childs[a].textContent === childs[b].textContent && 
                childs[a].textContent === childs[c].textContent) {
                return true
            }
        }
        return false
    }
    
    function highlightWinningCells() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        
        for (let combination of winningCombinations) {
            const [a, b, c] = combination
            if (childs[a].textContent !== '' && 
                childs[a].textContent === childs[b].textContent && 
                childs[a].textContent === childs[c].textContent) {
                childs[a].classList.add('win-cell')
                childs[b].classList.add('win-cell')
                childs[c].classList.add('win-cell')
                if (childs[a].textContent=='O'&&childs[b].textContent=='O'&&childs[c].textContent=='O'){
                    child_body.style.background='linear-gradient(45deg, #4ECDC4, #44A08D)'
                }else{
                    child_body.style.background='linear-gradient(45deg, #FF6B6B, #FF8E53)'
                }
                break
            }
        }
    }
    
    function isDraw() {
        return Array.from(childs).every(cell => cell.textContent !== '')
    }

    function resetGame() {
        // Сбрасываем стили перед началом анимации
        blur.style.left = '0px';
        blur.style.right = 'auto';
        blur.style.width = '0px';
        blur.style.height = window.innerHeight + 'px';
        
        setTimeout(() => {
            blur.style.width = window.innerWidth + 'px';
        }, 10);
        
        setTimeout(() => {
            childs.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('filled', 'win-cell');
                playerIsX=true
                playerX.style.height='160px'
                playerX.style.opacity='1'
                playerX.style.background='linear-gradient(45deg, #FF6B6B, #FF8E53)'
                playerO.style.height='80px'
                playerO.style.opacity='0.5'
                playerO.style.background='linear-gradient(45deg, #4ECDC4, #44A08D)'
                child_body.style.background='rgba(255, 255, 255, 0.95)'
            });
            // Убираем элемент (сжимаем влево)
            blur.style.left = 'auto';
            blur.style.right = '0px';
            blur.style.width = '0px';
        }, 1000);
    }
    
    // Добавляем кнопку сброса
    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'Новая игра'
    resetBtn.classList.add('reset-btn')
    resetBtn.addEventListener('click', resetGame)
    document.querySelector('.child_body').appendChild(resetBtn)
})