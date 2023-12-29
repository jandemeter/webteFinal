document.addEventListener("DOMContentLoaded", function () {
  const flagImage = document.getElementById("flag-image");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");

  let countries = [];
  let currentIndex = -1;
  let score = 1;
  let timeLeft = 5; // Set initial time to 5 seconds for each flag
  let elapsedSeconds = 0;
  let timerInterval;
  let currentLevel = 1;

  async function fetchData() {
    try {
      const response = await fetch("../data.json");
      const data = await response.json();

      if (currentLevel === 1) {
        countries = data.flags.Europe1;
      } else if (currentLevel === 2) {
        countries = data.flags.Europe2;
      } else if (currentLevel === 3) {
        countries = data.flags.Europe3;
      } else if (currentLevel === 4) {
        countries = data.flags.America;
      } else if (currentLevel === 5) {
        countries = data.flags["Asia + Africa"];
      }

      shuffleArray(countries);

      showNextFlag();
      showRandomOptions();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function showNextFlag() {
    currentIndex = (currentIndex + 1) % countries.length;
    const currentCountry = countries[currentIndex];
    flagImage.src = currentCountry.flag;
    flagImage.style.border = "1px solid #000";

    optionsContainer.innerHTML = "";

    const correctAnswerIndex = currentIndex;
    const wrongAnswerIndex = getRandomIndexes(
      countries.length,
      1,
      correctAnswerIndex
    )[0];

    const indexes = [correctAnswerIndex, wrongAnswerIndex];

    shuffleArray(indexes);

    if (indexes[0] == currentIndex) {
      createOptionButton(indexes[0], true);
      createOptionButton(indexes[1], false);
    } else {
      createOptionButton(indexes[0], false);
      createOptionButton(indexes[1], true);
    }

    timeLeft = 5; // Reset time to 5 seconds for each question

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function showRandomOptions() {
    showNextFlag();
  }

  function getRandomIndexes(max, count, exclude) {
    const indexes = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (indexes.indexOf(randomIndex) === -1 && randomIndex !== exclude) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function updateTimer() {
    elapsedSeconds++;
    timerElement.textContent = "TIME: " + timeLeft + "s";

    if (timeLeft === 0) {
      // Time is up, treat it as a wrong answer
      console.log("Time's up!");
      resetGame();
    }

    // Decrease time by 1 second
    timeLeft--;

    // Increase difficulty by reducing the available time as the game progresses
    if (elapsedSeconds % 10 === 0) {
      timeLeft = Math.max(1, timeLeft - 1);
    }
  }

  function updateScore() {
    score++;
    scoreElement.textContent = `LEVEL ${currentLevel} - QUESTION ${score} OUT OF 10`;
  }

  function resetGame() {
    document.getElementById("quiz-container").style.backgroundColor = "#ff4d4d";
    setTimeout(() => {
      document.getElementById("quiz-container").style.backgroundColor = "";

      showNextFlag();
    }, 500);

    score = 1;
    elapsedSeconds = 0;
    scoreElement.textContent = `LEVEL ${currentLevel} - QUESTION 1 OUT OF 10`;
    timerElement.textContent = "TIME: 0s";
    clearInterval(timerInterval);
  }

  function createOptionButton(index, isCorrect) {
    const optionButton = document.createElement("button");
    optionButton.textContent = countries[index].name;
    optionButton.classList.add("option-button");

    optionButton.addEventListener("click", () => {
      clearInterval(timerInterval);

      if (isCorrect) {
        console.log("Correct!");
        updateScore();
        if (score < 1) {
          showNextFlag();
        } else {
          // Move to the next level
          currentLevel++;
          score = 0;
          updateScore();
          if (currentLevel <= 5) {
            fetchData();
            showModal(); // Show modal when level is completed
          } else {
            // Quiz completed, you can add your completion logic here
            console.log("Quiz completed!");
          }
        }
      } else {
        console.log("Wrong!");
        resetGame();
      }
    });
    optionsContainer.appendChild(optionButton);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      // Simulate a click on the left option button
      simulateButtonClick(optionsContainer.firstChild);
    } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      // Simulate a click on the right option button
      simulateButtonClick(optionsContainer.lastChild);
    }
  });

  function simulateButtonClick(button) {
    const clickEvent = new Event("click");
    button.dispatchEvent(clickEvent);
  }

  function showModal() {
    const modalContainer = document.querySelector('.modal-container');
    const quizContainer = document.querySelector('.quiz-container');

    // Display the modal and confetti canvas
    modalContainer.style.display = 'block';
    quizContainer.style.display = 'none';

    // Additional logic for handling the modal display
  }

  function nextLevel() {
    const modalContainer = document.querySelector('.modal-container');
    const quizContainer = document.querySelector('.quiz-container');

    modalContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    // Reset the timer to 5 seconds for each question in the next level
    timeLeft = 5;

    // Additional logic for handling the modal close
  }

  // Event listener for the "Next Level" button
  const nextLevelButton = document.querySelector('.modal-button');
  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", function () {
      console.log("Next Level button clicked");
      nextLevel();
    });
  }

  fetchData();
});
