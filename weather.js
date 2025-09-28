
    


   const apiKey = "cc0c6f2482424f69bd874449252406";

const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const historyList = document.getElementById('historyList');

// Load search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Display initial history
displayHistory();

async function checkWeather(city) {
    try {
        if (!city || city.trim() === '') {
            alert('Please enter a city name');
            return;
        }

        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        
        if (!response.ok) {
            throw new Error(`Weather data not found for ${city}`);
        }
        
        const data = await response.json();
        console.log(data);

        // Update weather information
        document.querySelector(".city").innerHTML = data.location.name;
        document.querySelector('.temp').innerHTML = Math.round(data.current.temp_c) + " °C";
        document.querySelector('.humidity').innerHTML = data.current.humidity + " %";
        document.querySelector('.wind').innerHTML = data.current.wind_kph + " km/hr";
        
        // Update weather icon
        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.src = "https:" + data.current.condition.icon;
        weatherIcon.alt = data.current.condition.text;

        // Add to search history
        addToHistory(city.trim());

    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching weather data: ' + error.message);
    }
}

// Add city to search history
function addToHistory(city) {
    // Remove city if it already exists (to avoid duplicates)
    searchHistory = searchHistory.filter(item => 
        item.toLowerCase() !== city.toLowerCase()
    );
    
    // Add city to beginning of array
    searchHistory.unshift(city);
    
    // Keep only last 5 searches
    if (searchHistory.length > 5) {
        searchHistory = searchHistory.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    
    // Update display
    displayHistory();
}

// Display search history
function displayHistory() {
    historyList.innerHTML = '';
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No search history yet</p>';
        return;
    }
    
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${city}</span>
            <button class="delete-btn" data-city="${city}">×</button>
        `;
        
        // Click on city name to search again
        historyItem.querySelector('span').addEventListener('click', () => {
            searchBox.value = city;
            checkWeather(city);
        });
        
        // Delete button
        historyItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the city click
            removeFromHistory(city);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Remove city from history
function removeFromHistory(city) {
    searchHistory = searchHistory.filter(item => 
        item.toLowerCase() !== city.toLowerCase()
    );
    
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    displayHistory();
}

// Clear all history
function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('weatherSearchHistory');
    displayHistory();
}

// Event listeners
searchButton.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});