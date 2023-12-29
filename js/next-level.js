document.addEventListener("DOMContentLoaded", function () {
  // ... (other code)

  // Add event listener directly
  const nextLevelButton = document.getElementById("nextLevelButton");
  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", function () {
        console.log("next level");
      const modalContainer = document.querySelector('.modal-container');
      const quizContainer = document.querySelector('.quiz-container');

      modalContainer.style.display = 'none';
      quizContainer.style.display = 'block';

      // Additional logic for handling the modal close
    });
  }

  // ... (other code)
});
