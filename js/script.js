document.addEventListener("DOMContentLoaded", function () {
  const flagImage = document.getElementById("flag-image");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");

  let countries = [];
  let currentIndex = -1;
  let score = 0;
  let timeLeft = 0; // Updated initial value for time
  let elapsedSeconds = 0; // New variable to track elapsed time
  let timerInterval;

  async function fetchData() {
    try {
      const response = await fetch("../data.json");
      const data = await response.json();
      countries = data.countries;

      // Shuffle the array of countries
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

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Generate one correct and one wrong answer
    const correctAnswerIndex = currentIndex;
    const wrongAnswerIndex = getRandomIndexes(
      countries.length,
      1,
      correctAnswerIndex
    )[0];

    // Create an array to hold both indexes
    const indexes = [correctAnswerIndex, wrongAnswerIndex];

    // Shuffle the array to randomize button positions
    shuffleArray(indexes);

    // Create option buttons based on shuffled indexes
    if (indexes[0] == currentIndex) {
      createOptionButton(indexes[0], true); // Correct answer
      createOptionButton(indexes[1], false); // Wrong answer
    } else {
      createOptionButton(indexes[0], false); // Correct answer
      createOptionButton(indexes[1], true); // Wrong answer
    }

    // Reset time left
    timeLeft = 0;

    // Start or restart the timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function showRandomOptions() {
    // Show options on page load
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
    timerElement.textContent = "Time: " + elapsedSeconds + "s";

    // Increase difficulty by reducing the available time as the game progresses
    if (elapsedSeconds % 10 === 0) {
      timeLeft = Math.max(1, timeLeft - 1);
    }

    
  }

  function updateScore() {
    score++;
    scoreElement.textContent = "Score: " + score +"/47";
  }

  function resetGame() {
    // Reset score and elapsed time
    score = 0;
    elapsedSeconds = 0;
    scoreElement.textContent = "Score: 0/47";
    timerElement.textContent = "Time: 0s";
    clearInterval(timerInterval);
    showNextFlag();
  }

  function createOptionButton(index, isCorrect) {
    const optionButton = document.createElement("button");
    optionButton.textContent = countries[index].name;
    optionButton.classList.add("option-button");

    optionButton.addEventListener("click", () => {
      clearInterval(timerInterval); // Stop the timer on button click

      if (isCorrect) {
        // Handle correct answer logic
        console.log("Correct!");
        updateScore();
      } else {
        // Handle wrong answer logic
        console.log("Wrong!");
        resetGame();
      }
      showNextFlag()
    });
    optionsContainer.appendChild(optionButton);
  }

  // Event listener for left and right arrow keys
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      // Simulate a click on the left option button
      simulateButtonClick(optionsContainer.firstChild);
    } else if (event.key === "ArrowRight") {
      // Simulate a click on the right option button
      simulateButtonClick(optionsContainer.lastChild);
    }
  });

  function simulateButtonClick(button) {
    const clickEvent = new Event("click");
    button.dispatchEvent(clickEvent);
  }

  // Fetch data from data.json and display the first flag on page load
  fetchData();
});
