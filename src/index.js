class WeatherApp {
  constructor(city) {
    this.city = city;
    this.apiKey = "b2a5adcct04b33178913oc335f405433";
    this.apiUrl = `https://api.shecodes.io/weather/v1/current?query=${this.city}&key=${this.apiKey}&units=metric`;
    this.forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${this.city}&key=${this.apiKey}&units=metric`;
  }

  async fetchWeatherData() {
    this.clearError();
    this.clearUI();

    try {
      const response = await axios.get(this.apiUrl);
      const inputCity = this.city.trim().toLowerCase();
      const apiCity = response.data.city.trim().toLowerCase();

      if (apiCity !== inputCity) {
        this.displayErrorMessage(
          "City name is invalid. Please check the name."
        );
        return;
      }

      this.displayWeather(response);
      this.fetchForecast();
    } catch (error) {
      this.displayErrorMessage("City name is invalid. Please check the name.");
    }
  }

  clearError() {
    const errorElement = document.querySelector("#error-message");
    errorElement.style.display = "none";
  }

  clearUI() {
    document.querySelector("#temperature").innerHTML = "";
    document.querySelector("#city").innerHTML = "";
    document.querySelector("#description").innerHTML = "";
    document.querySelector("#humidity").innerHTML = "";
    document.querySelector("#wind-speed").innerHTML = "";
    document.querySelector("#time").innerHTML = "";
    document.querySelector("#icon").innerHTML = "";
    document.querySelector("#forecast").innerHTML = "";

    document.querySelector(".weather-app-data").style.display = "none";
    document.querySelector("#forecast").style.display = "none";
  }

  displayWeather(response) {
    const { temperature, city, time, condition, wind, humidity } =
      response.data;

    document.querySelector(".weather-app-data").style.display = "flex";
    document.querySelector("#forecast").style.display = "flex";

    document.querySelector("#temperature").innerHTML =
      typeof temperature?.current === "number"
        ? Math.round(temperature.current)
        : "";

    document.querySelector("#city").innerHTML = city;
    document.querySelector("#description").innerHTML =
      condition?.description || "";

    document.querySelector("#humidity").innerHTML =
      typeof humidity === "number" ? `${humidity}%` : "N/A";

    document.querySelector("#wind-speed").innerHTML =
      typeof wind?.speed === "number" ? `${wind.speed}km/h` : "N/A";

    document.querySelector("#time").innerHTML = time
      ? this.formatDate(new Date(time * 1000))
      : "";

    document.querySelector("#icon").innerHTML = condition?.icon_url
      ? `<img src="${condition.icon_url}" class="weather-app-icon" />`
      : "";
  }

  displayErrorMessage(message) {
    const errorElement = document.querySelector("#error-message");
    errorElement.innerHTML = message;
    errorElement.style.display = "block";
    this.clearUI();
  }

  async fetchForecast() {
    try {
      const response = await axios.get(this.forecastUrl);
      this.displayForecast(response);
    } catch (error) {
      this.displayErrorMessage("Unable to load forecast. Please try again.");
    }
  }

  displayForecast(response) {
    let forecastHtml = "";
    if (response.data.daily && response.data.daily.length > 0) {
      response.data.daily.forEach((day, index) => {
        if (index < 6) {
          // ⬇️ INLINE forecast blok – voorkomt vertical stacking
          forecastHtml += `<div class="weather-forecast-day">
            <div class="weather-forecast-date">${this.formatDay(day.time)}</div>
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
          </div>`;
        }
      });
    } else {
      forecastHtml = `<p>Unable to load forecast data.</p>`;
    }
    document.querySelector("#forecast").innerHTML = forecastHtml;
  }

  formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours}:${minutes}`;
  }
}

// 📍 Event listener op zoekformulier
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let cityInput = document.querySelector("#search-form-input").value;
    let weatherApp = new WeatherApp(cityInput);
    weatherApp.fetchWeatherData();
  });

// 📍 Laad standaardstad
let weatherApp = new WeatherApp("Paris");
weatherApp.fetchWeatherData();
