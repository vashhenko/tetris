function updateScore() {
   
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
   
      scoreElement.textContent = score;
    }
  }
    updateScore();
  