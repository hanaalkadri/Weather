class WeatherApp {
  constructor(city) {
    this.city = city;
    this.apiKey = "b2a5adcct04b33178913oc335f405433"; // API key securely fetched
    this.apiUrl = `https://api.shecodes.io/weather/v1/current?query=${this.city}&key=${this.apiKey}&units=metric`;
    this.forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${this.city}&key=${this.apiKey}&units=metric`;
  }

  // Fetch weather data from the API
  async fetchWeatherData() {
    this.clearError(); // Clear any previous error messages
    try {
      const response = await axios.get(this.apiUrl);
      this.displayWeather(response);
      this.fetchForecast();
    } catch (error) {
      this.displayErrorMessage(
        "City not found or API error. Please try again."
      );
    }
  }

  // Clear the error message from the UI
  clearError() {
    const errorElement = document.querySelector("#error-message");
    errorElement.style.display = "none"; // Hide the error message initially
  }

  // Display weather information
  displayWeather(response) {
    const { temperature, city, time, condition, wind, humidity } =
      response.data;
    document.querySelector("#temperature").innerHTML = Math.round(
      temperature.current
    );
    document.querySelector("#city").innerHTML = city;
    document.querySelector("#description").innerHTML = condition.description;
    document.querySelector("#humidity").innerHTML = `${humidity}%`;
    document.querySelector("#wind-speed").innerHTML = `${wind.speed}km/h`;
    document.querySelector("#time").innerHTML = this.formatDate(
      new Date(time * 1000)
    );
    document.querySelector(
      "#icon"
    ).innerHTML = `<img src="${condition.icon_url}" class="weather-app-icon" />`;
  }

  // Display the error message
  displayErrorMessage(message) {
    const errorElement = document.querySelector("#error-message");
    errorElement.innerHTML = message;
    errorElement.style.display = "block"; // Show the error message if an error occurs
  }

  // Fetch forecast data
  async fetchForecast() {
    try {
      const response = await axios.get(this.forecastUrl);
      this.displayForecast(response);
    } catch (error) {
      this.displayErrorMessage("Unable to load forecast. Please try again.");
    }
  }

  // Display forecast information
  displayForecast(response) {
    let forecastHtml = "";
    if (response.data.daily && response.data.daily.length > 0) {
      response.data.daily.forEach((day, index) => {
        if (index < 6) {
          forecastHtml += `
            <div class="weather-forecast-day">
              <div class="weather-forecast-date">${this.formatDay(
                day.time
              )}</div>
              <div><img src="${
                day.condition.icon_url
              }" class="weather-forecast-icon" /></div>
              <div class="weather-forecast-temperatures">
                <div class="weather-forecast-temperature"><strong>${Math.round(
                  day.temperature.maximum
                )}°</strong></div>
                <div class="weather-forecast-temperature">${Math.round(
                  day.temperature.minimum
                )}°</div>
              </div>
            </div>
          `;
        }
      });
    } else {
      forecastHtml = `<p>Unable to load forecast data.</p>`;
    }
    document.querySelector("#forecast").innerHTML = forecastHtml;
  }

  // Format the day of the week
  formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  // Format date to readable format
  formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours}:${minutes}`;
  }
}

// Event listener for the search button
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let cityInput = document.querySelector("#search-form-input").value;
    let weatherApp = new WeatherApp(cityInput); // Create a new instance of WeatherApp
    weatherApp.fetchWeatherData(); // Fetch the weather data
  });

// Default city when the page loads
let weatherApp = new WeatherApp("Paris");
weatherApp.fetchWeatherData();
