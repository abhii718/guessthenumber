let randomNumber = Math.floor(Math.random() * 100) + 1;
let previousGuesses = [];
let remainingGuesses = 10;
let gameOver = false;

const guessInput = document.getElementById('guessField');
const submitButton = document.getElementById('subt');
const guessesDisplay = document.querySelector('.guesses');
const remainingDisplay = document.querySelector('.lastResult');
const hintMessage = document.querySelector('.lowOrHi');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (gameOver) return;

    const userGuess = parseInt(guessInput.value);
    if (validateGuess(userGuess)) {
        processGuess(userGuess);
    }
});

function validateGuess(guess) {
    if (isNaN(guess)) {
        showMessage('Please enter a valid number! ❌', 'high');
        return false;
    }
    if (guess < 1 || guess > 100) {
        showMessage('Number must be between 1-100! ⚠️', 'high');
        return false;
    }
    if (previousGuesses.includes(guess)) {
        showMessage('You already guessed that! 🤨', 'high');
        return false;
    }
    return true;
}

function processGuess(guess) {
    previousGuesses.push(guess);
    remainingGuesses--;
    
    updateDisplay();
    checkWinCondition(guess);

    if (remainingGuesses === 0 && !gameOver) {
        endGame(false);
    }
}

function updateDisplay() {
    guessesDisplay.innerHTML = previousGuesses.map(guess => 
        `<span style="border: 2px solid ${guess === randomNumber ? '#00ff88' : '#ff4444'}">${guess}</span>`
    ).join('');
    
    remainingDisplay.textContent = remainingGuesses;
    guessInput.value = '';
}

function checkWinCondition(guess) {
    if (guess === randomNumber) {
        endGame(true);
    } else {
        const hint = guess < randomNumber ? 'low' : 'high';
        showMessage(`Too ${hint}! ${hint === 'low' ? '⬆️ Higher!' : '⬇️ Lower!'}`, hint);
    }
}

function showMessage(message, type) {
    hintMessage.textContent = message;
    hintMessage.className = `lowOrHi ${type}`;
}

function endGame(won) {
    gameOver = true;
    guessInput.disabled = true;
    submitButton.disabled = true;
    
    if (won) {
        showMessage(`🎉 Correct! You won with ${10 - remainingGuesses} guesses!`, 'win');
        triggerConfetti();
    } else {
        showMessage(`💥 Game Over! Number was ${randomNumber}`, 'high');
    }

    showNewGameButton();
}

function showNewGameButton() {
    const newGameBtn = document.createElement('button');
    newGameBtn.id = 'newGame';
    newGameBtn.textContent = 'New Game 🔄';
    newGameBtn.addEventListener('click', resetGame);
    document.querySelector('.resultParas').appendChild(newGameBtn);
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    previousGuesses = [];
    remainingGuesses = 10;
    gameOver = false;
    
    guessInput.disabled = false;
    submitButton.disabled = false;
    
    guessesDisplay.innerHTML = '';
    remainingDisplay.textContent = remainingGuesses;
    hintMessage.textContent = 'Start guessing! 🤔';
    hintMessage.className = 'lowOrHi';
    
    document.querySelector('#newGame')?.remove();
}

function triggerConfetti() {
    // Confetti animation logic
    for(let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}deg, 100%, 50%)`;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
