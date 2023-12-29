document.addEventListener("DOMContentLoaded", function () {
  // ... (other code)

  // Add event listener directly
  const nextLevelButton = document.querySelector(".modal-button");
  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", function () {
      const modalContainer = document.querySelector('.modal-container');
      const quizContainer = document.querySelector('.quiz-container');

      modalContainer.style.display = 'none';
      quizContainer.style.display = 'block';

      // Additional logic for handling the modal close
    });
  }
});
