
// Define API key

const API_KEY = '1b3ccbbbecb0224059af59271277bfd6';

//Declare variables used frequently

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyList = document.getElementById('history');
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');
const clearHistoryButton = document.getElementById('clear-history-button');



// On clicking Clear history button, clear last searches
clearHistoryButton.addEventListener('click', function()
{
    localStorage.removeItem('weatherHistory');
    renderHistory(); // Update the history list
});



// On page load/refresh, clear last searches
window.addEventListener('load', function()
{
    localStorage.removeItem('weatherHistory');
    renderHistory(); // Update the history list
});



// Event listener for form submission
searchForm.addEventListener('submit', async function(event)
{
    event.preventDefault();
    const cityName = searchInput.value.trim(); // Get the city name
    if(cityName !== '')
    {
        try
        {
            const weatherData = await fetchWeatherData(cityName); // Fetch current weather data
            displayWeather(weatherData); // Display current weather conditions
            saveToHistory(cityName); // Save city to search history
            const forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon); // Fetch 5-day forecast data
            displayForecast(forecastData); // Display the 5-day forecast
        }
        catch (error)
        {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
        
        searchInput.value = ''; // Clear the input field
    }
});


// Function to fetch current weather data
async function fetchWeatherData(cityName)
{
    // GET request to the OpenWeatherMap API to fetch weather data
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`); 
    
    if(!response.ok) throw new Error('City not found');
    //Return response as JSON
    return response.json(); 
}


// Function to display current weather
function displayWeather(data)
{
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // URL for weather icon

    // HTML to display current weather
    const html = `<div class="current-weather">
                    <h2>${data.name}</h2>
                    <p>${currentDate}</p>
                    <img src="${iconUrl}" alt="${data.weather[0].description}">
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                </div>`;

    todaySection.innerHTML = html;
}


// Function to save a search
function saveToHistory(cityName)
{
    // Get the existing search history
    let cities = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    // Check if entered city is already in search history
    if(!cities.includes(cityName))
    {
        cities.push(cityName);
        localStorage.setItem('weatherHistory', JSON.stringify(cities));
        renderHistory(); // Render the updated search history
    }
}



// Function to render search history
function renderHistory()
{
    // Get the search history from local storage or initialise as empty array
    let cities = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    // Generate HTML code for each city in the search history and insert it into the 'historyList' element
    historyList.innerHTML = cities.map(city => `<a href="#" class="list-group-item list-group-item-action">${city}</a>`).join('');
    
    // Attach event listener to each history item
    historyList.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', async function(event)
        {
            event.preventDefault();
            const cityName = item.textContent; // Get the name of the clicked city
            try
            {
                const weatherData = await fetchWeatherData(cityName); // Fetch current weather data
                displayWeather(weatherData); // Display current weather conditions
                const forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon); // Fetch 5-day forecast data
                displayForecast(forecastData); // Display the 5-day forecast
            }
            catch(error)
            {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    });
}




// Function to fetch 5-day forecast data
async function fetchForecast(lat, lon)
{
    // GET request to the OpenWeatherMap API to fetch forecast data
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if(!response.ok) throw new Error('Forecast data not available');

    //Return response as JSON
    const data = await response.json();

    // Return the first 5 forecast data
    return data.list.slice(0, 5);
}



// Function to display 5-day forecast data
function displayForecast(forecastData)
{
    forecastSection.innerHTML = ''; // Clear previous forecast data
    let currentDate = new Date(); // Get current date
    for(let i = 0; i < 5; i++)
    {
        const forecastDate = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); // Format current date as day
        const iconUrl = `http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png`; // URL for weather icon

        // HTML code to display forecast data
        const html = `<div class="col-lg-2">
                        <h3>${forecastDate}</h3>
                        <img src="${iconUrl}" alt="${forecastData[i].weather[0].description}">
                        <p>Temperature: ${forecastData[i].main.temp}°C</p>
                        <p>Humidity: ${forecastData[i].main.humidity}%</p>
                        <p>Wind Speed: ${forecastData[i].wind.speed} m/s</p>
                    </div>`;

        forecastSection.innerHTML += html;
        currentDate.setDate(currentDate.getDate() + 1); // Increment current date by 1 day
    }
}



// Render search history when page loads
renderHistory(); 