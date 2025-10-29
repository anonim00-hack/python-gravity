document.addEventListener('DOMContentLoaded', () => {
    const place = document.querySelector('.place')
    const playerDisplay = document.querySelector('.player')
    const blur = document.querySelector('.blur')
    let playerX = true

    for (let i = 0; i < 9; i++) {
        const child = document.createElement('div')
        child.classList.add('cell')
        place.appendChild(child)
    }
    
    const childs = document.querySelectorAll('.cell')
    updatePlayerDisplay()
    
    childs.forEach((el, index) => {
        el.addEventListener('click', () => {
            if (el.textContent == '' && !checkWin() && !isDraw()) {
                const symbol = playerX ? 'X' : 'O'
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
                    playerX = !playerX
                    updatePlayerDisplay()
                }
            }
        })
    })
    
    function updatePlayerDisplay() {
        playerDisplay.textContent = playerX ? 'X' : 'O'
        playerDisplay.style.background = playerX ? 
            'linear-gradient(45deg, #FF6B6B, #FF8E53)' : 
            'linear-gradient(45deg, #4ECDC4, #44A08D)'
    }
    
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
                break
            }
        }
    }
    
    function isDraw() {
        return Array.from(childs).every(cell => cell.textContent !== '')
    }
    let rigth = true
    function resetGame() {
        blur.style.right = '0px'
        blur.style.height = window.innerHeight+'px'
        blur.style.width = window.innerWidth+'px'
        rigth=!rigth
        setTimeout(()=>{
            if (rigth) {
                blur.style.left = '0px'
                blur.style.width='0px'
            }else{
                blur.style.right = '0px'
                blur.style.width='0px'
            }
            childs.forEach(cell => {
                cell.textContent = ''
                cell.removeAttribute('data-value')
                cell.classList.remove('filled', 'win-cell')
            })
            playerX = true
            updatePlayerDisplay()
        },1000)
    }
    
    // Добавляем кнопку сброса
    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'Новая игра'
    resetBtn.classList.add('reset-btn')
    resetBtn.addEventListener('click', resetGame)
    document.querySelector('.child_body').appendChild(resetBtn)
})