document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const startGameBtn = document.getElementById('start-game-btn');
  
    usernameInput.addEventListener('input', function() {
      startGameBtn.disabled = !usernameInput.value.trim();
    });
    
    document.getElementById('user-form').addEventListener('submit', function(e) {
      e.preventDefault(); 
      const username = usernameInput.value.trim();
      if (username) {
        window.open(`index.html?username=${encodeURIComponent(username)}`);
        window.close();
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const exitButton = document.querySelector('#exit-btn');
  
    if (exitButton) {
      exitButton.addEventListener('click', function () {
        window.close();
      });
    }
  });
  