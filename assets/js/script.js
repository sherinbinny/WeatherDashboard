
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