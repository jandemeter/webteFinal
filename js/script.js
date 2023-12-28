document.addEventListener("DOMContentLoaded", function () {
    const flagImage = document.getElementById("flag-image");
    const optionsContainer = document.getElementById("options-container");
  
    let countries = [];
    let currentIndex = -1;
  
    async function fetchData() {
      try {
        const response = await fetch('../data.json');
        const data = await response.json();
        countries = data.countries;
        showNextFlag();
        showRandomOptions();
      } catch (error) {
        console.error('Error fetching data:', error);
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
      const wrongAnswerIndex = getRandomIndexes(countries.length, 1, correctAnswerIndex)[0];
  
      createOptionButton(correctAnswerIndex, true); // Correct answer
      createOptionButton(wrongAnswerIndex, false); // Wrong answer
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
  
    function createOptionButton(index, isCorrect) {
        const optionButton = document.createElement("button");
        optionButton.textContent = countries[index].name;
        optionButton.classList.add("option-button"); // Add the option-button class
        optionButton.addEventListener("click", () => {
          if (isCorrect) {
            // Handle correct answer logic
            console.log("Correct!");
          } else {
            // Handle wrong answer logic
            console.log("Wrong!");
          }
          showNextFlag();
        });
        optionsContainer.appendChild(optionButton);
      }
      
  
    // Fetch data from data.json and display the first flag on page load
    fetchData();
  });
  