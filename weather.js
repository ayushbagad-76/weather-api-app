// Get a free API key at https://openweathermap.org/api and paste it below.
// Note: new keys can take a little while to activate.
const apiKey = "YOUR_API_KEY_HERE";

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const errorDisplay = document.querySelector(".errorDisplay");

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        displayError("Please enter a city");
        return;
    }

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (response.status === 404) {
        throw new Error("City not found");
    }
    if (response.status === 401) {
        throw new Error("Invalid API key");
    }
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name,
        main: { temp, humidity },
        weather: [{ description, id }],
        wind: { speed }
    } = data;

    errorDisplay.textContent = "";
    card.hidden = false;

    card.querySelector(".cityDisplay").textContent = name;
    card.querySelector(".tempDisplay").textContent = `${temp.toFixed(1)}°C`;
    card.querySelector(".humidityDisplay").textContent = `Humidity: ${humidity}%`;
    card.querySelector(".windDisplay").textContent = `Wind: ${(speed * 3.6).toFixed(1)} km/h`;
    card.querySelector(".descDisplay").textContent = description;
    card.querySelector(".weatherEmoji").textContent = getWeatherEmoji(id);
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return "⛈️";
        case weatherId >= 300 && weatherId < 400:
            return "🌦️";
        case weatherId >= 500 && weatherId < 600:
            return "🌧️";
        case weatherId >= 600 && weatherId < 700:
            return "❄️";
        case weatherId >= 700 && weatherId < 800:
            return "🌫️";
        case weatherId === 800:
            return "☀️";
        case weatherId === 801:
            return "🌤️";
        case weatherId === 802:
            return "⛅";
        case weatherId > 802 && weatherId < 810:
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message) {
    card.hidden = true;
    errorDisplay.textContent = message;
}
