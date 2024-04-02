
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