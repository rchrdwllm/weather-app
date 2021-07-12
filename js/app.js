const key = "845e2e1e2a2e86550cb2b8e79422bc3f";
const form = document.querySelector("form");
const cityInput = document.querySelector(".city-input");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const noWeatherData = document.querySelector(".no-weather-data");
const weatherContainer = document.querySelector(".weather-container");
const weatherList = [];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetchData();
});
weatherContainer.addEventListener("click", (e) => {
    removeData(e);
});
window.addEventListener("scroll", toggleBlur);

updateDateTime();

async function fetchData() {
    axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${key}&units=metric`
        )
        .then((res) => {
            if (weatherList.includes(res.data.name)) {
                noData(`<p>Oops! ${res.data.name} already exists!</p>`);
            } else {
                weatherList.push(res.data.name);

                updateUI(res.data);
            }
        })
        .catch(() => {
            noData(`<p>No city '${cityInput.value}' found</p>`);
        })
        .then(() => {
            updateDateTime();
        });
}

function updateUI(data) {
    const weatherData = document.createElement("div");
    const markup = `
    <div class="header">
        <p class="city">${data.name} | ${data.sys.country}</p>
        <button class="remove material-icons">&#xe5cd;</button>
    </div>
    <div class="info">
        <div class="temp-pic">
            <h1 class="temp">${Math.round(data.main.temp)} °C</h1>
            <img
                src="http://openweathermap.org/img/wn/${
                    data.weather[0].icon
                }@2x.png"
                alt="weather icon"
                class="pic"
            />
        </div>
        <p class="high-low">
            <span class="high">${Math.round(data.main.temp_max)}</span> °C /
            <span class="low">${Math.round(data.main.temp_min)}</span> °C
        </p>
        <p class="desc">${
            data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1)
        }</p>
        <div class="divider"></div>
        <div class="misc">
            <p class="humidity">Humidity: ${data.main.humidity}%</p>
            <p class="wind">Wind: ${data.wind.speed} m/s</p>
            </div>
        </div>
    `;

    noWeatherData.classList.add("hide");

    weatherData.classList.add("weather-data");
    weatherData.innerHTML = markup;
    weatherContainer.appendChild(weatherData);

    cityInput.value = "";
}

function noData(string) {
    noWeatherData.innerHTML = string;
    noWeatherData.classList.remove("hide");

    cityInput.value = "";
}

function removeData(e) {
    if (e.target.classList.contains("remove")) {
        const parentElement = e.target.parentElement.parentElement;
        const name = parentElement.querySelector(".city").innerHTML;
        const index = weatherList.findIndex((data) => data === name);

        weatherList.splice(index, 1);

        parentElement.remove();

        if (weatherList.length === 0) {
            noData("<p>No weather data</p>");
        }
    }
}

function updateDateTime() {
    const dateTime = new Date();

    const currentMonth = new Intl.DateTimeFormat("en-US", {
        month: "long",
    }).format(dateTime);
    const currentDay = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
    }).format(dateTime);
    const currentDate = dateTime.getDate();
    const currentHour = Math.abs(dateTime.getHours() - 12);
    const minutes = dateTime.getMinutes();

    console.log(currentHour);

    time.innerHTML = `${currentHour === 0 ? "12" : currentHour}:${minutes < 10 ? "0" + minutes : minutes}`;
    date.innerHTML = `${currentDay}, ${currentMonth} ${currentDate}`;
}

function toggleBlur() {
    const scrollValue = window.scrollY;

    if (scrollValue > 1) {
        form.classList.add("on-scroll");
    } else {
        form.classList.remove("on-scroll");
    }
}
