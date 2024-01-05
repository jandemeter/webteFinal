document.addEventListener("DOMContentLoaded", function () {
  const flagImage = document.getElementById("flag-image");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const hintImage = document.getElementById("hint-image");
  const correctAnswerElement = document.getElementById("correct-answer");

  let countries = [];
  let currentIndex = -1;
  let timeLeft = 5; // Set initial time to 5 seconds for each flag
  let elapsedSeconds = 0;
  let timerInterval;
  let questionAnswered = false; // Flag to track if the question has been answered
  let currentLevel = 1;
  let score = 1;

  currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
  score = parseInt(localStorage.getItem("score")) || 1;

  async function fetchData() {
    try {
      const response = await fetch("../data.json");
      const data = await response.json();

      scoreElement.textContent = `LEVEL ${currentLevel} - QUESTION ${score} OUT OF 10`;
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

      questionAnswered = false;
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
    localStorage.setItem("score", score);
    localStorage.setItem("currentLevel", currentLevel);
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
    localStorage.setItem("score", score);
    localStorage.setItem("currentLevel", currentLevel);
  }

  function handleMouseOver(isCorrect) {
    if (!questionAnswered) {
      clearInterval(timerInterval);

      if (isCorrect) {
        console.log("Correct!");
        updateScore();
        flagImage.style.border = "10px solid #4CAF50";
        if (score < 11) {
          setTimeout(() => {
            showNextFlag();
            flagImage.style.border = "1px solid #000";
          }, 600);
        } else {
          currentLevel++;
          score = 0;
          updateScore();
          if (currentLevel <= 5) {
            fetchData();
            showModal();
          } else {
            localStorage.setItem("currentLevel", 1);
            console.log("nastavil osm na 1");
            window.location.href = "congratulations.html";
          }
        }
      } else {
        console.log("Wrong!");
        resetGame();
      }

      questionAnswered = true;
    } else {
      questionAnswered = false;
    }
  }
  function createOptionButton(index, isCorrect) {
    const optionButton = document.createElement("button");
    optionButton.textContent = countries[index].name;
    optionButton.classList.add("option-button");

    // optionButton.addEventListener("click", function (event) {
    //   event.stopPropagation();
    // });

    // optionButton.addEventListener("mousedown", function (event) {
    //   event.preventDefault();
    // });

    optionButton.addEventListener("mouseover", function () {
      handleMouseOver(isCorrect);
    });

    optionsContainer.appendChild(optionButton);
  }

  function showCorrectAnswer(element) {
    const correctIndex = currentIndex;
    const correctCountry = countries[correctIndex];
    element.textContent = `${correctCountry.name}`;
    element.style.display = "block"; // Show the correct answer
  }

  function hideCorrectAnswer(element) {
    element.style.display = "none"; // Hide the correct answer
  }

  hintImage.addEventListener("mouseover", function () {
    showCorrectAnswer(correctAnswerElement); // Show the correct answer when hovering over the lightbulb
  });

  hintImage.addEventListener("mouseout", function () {
    hideCorrectAnswer(correctAnswerElement); // Hide the correct answer when not hovering over the lightbulb
  });

  optionsContainer.addEventListener("mouseleave", function () {
    questionAnswered = false;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      questionAnswered = false;
      // Simulate a click on the left option button
      optionsContainer.firstChild.style.backgroundColor = "#b8b0c9";
      simulateButtonClick(optionsContainer.firstChild);
    } else if (
      event.key === "ArrowRight" ||
      event.key === "d" ||
      event.key === "D"
    ) {
      questionAnswered = false;
      // Simulate a click on the right option button
      optionsContainer.lastChild.style.backgroundColor = "#b8b0c9";
      simulateButtonClick(optionsContainer.lastChild);
    }
  });

  function simulateButtonClick(button) {
    const hoverEvent = new Event("mouseover");
    button.dispatchEvent(hoverEvent);
  }

  function showModal() {
    const modalContainer = document.querySelector(".modal-container");
    const quizContainer = document.querySelector(".quiz-container");

    // Display the modal and confetti canvas
    modalContainer.style.display = "block";
    quizContainer.style.display = "none";

    // Additional logic for handling the modal display
  }

  function nextLevel() {
    const modalContainer = document.querySelector(".modal-container");
    const quizContainer = document.querySelector(".quiz-container");

    modalContainer.style.display = "none";
    quizContainer.style.display = "block";
    timeLeft = 5;
  }

  const nextLevelButton = document.querySelector(".modal-button");
  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", function () {
      console.log("Next Level button clicked");
      nextLevel();
    });
  }
  // JavaScript to handle button click event
  document.getElementById("go-to-index").addEventListener("click", function () {
    window.location.href = "../index.html";
  });

  let buttonClickedAfterTilt = false;
  let debounceTimeout;
  let initialAlpha;

  window.addEventListener("deviceorientation", function (event) {
    // Display the current alpha value

    // Adjust alpha value to be in the range [-180, 180]
    const adjustedAlpha = event.alpha > 180 ? event.alpha - 360 : event.alpha;

    // Check conditions and simulate button click with debounce
    if (!initialAlpha) {
      initialAlpha = adjustedAlpha;
    }

    const angleThreshold = 20; // Adjust the threshold as needed

    if (
      adjustedAlpha > initialAlpha + angleThreshold &&
      !buttonClickedAfterTilt
    ) {
      debounceButtonClick(optionsContainer.firstChild);
    } else if (
      adjustedAlpha < initialAlpha - angleThreshold &&
      !buttonClickedAfterTilt
    ) {
      debounceButtonClick(optionsContainer.lastChild);
    } else if (
      adjustedAlpha > initialAlpha - angleThreshold &&
      adjustedAlpha < initialAlpha + angleThreshold
    ) {
      buttonClickedAfterTilt = false;
    }
  });

  function debounceButtonClick(button) {
    if (!buttonClickedAfterTilt) {
      simulateButtonClick(button);
      buttonClickedAfterTilt = true;

      // Set a timeout to reset buttonClickedAfterTilt after a certain delay
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        buttonClickedAfterTilt = false;
      }, 1000); // Adjust the delay as needed
    }
  }

  fetchData();
});

window.addEventListener("load", () => {
  registerSW();
});

async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("../sw.js");
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}
