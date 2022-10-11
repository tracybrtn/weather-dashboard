//DOM
var searchBtn = document.getElementById('submit-btn');
var cityEl = document.getElementById('city');

//Key assigned by OpenWeather API host
var apiKey = 'e64b6c495acf85923e229f6fbed4cebb'

//Converts city into latitude and longitude
var getLocation = function(city) {
    var apiUrL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(apiUrL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                // If no data comes back because the city does not exist
                if (data.length === 0) {
                    alert('Enter a valid city');
                }
                else {

                var lat = data[0].lat;
                var lon = data[0].lon;
                
                getWeather(lat, lon);
                }
            })
        }
    })
}


//passes latitude, longitude and gets the weather forecast
var getWeather = function(lat, lon) {
    
    var apiUrL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&contd=&appid=${apiKey}`;

    fetch(apiUrL).then(function(response) {
        if (response.ok) {
            console.log(response) 
            response.json().then(function(data){
                console.log(data);
             displayWeather(data);

            })
        } else {
            alert('Error in getWeather function');
        }
    })
}


var displayWeather = (data) => {
    var city = data.city.name
    var date = moment().format('MMMM DD, YYYY')
    //icon representing weather conditions
    var temperature = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;

    var currentWeather = $(`
    <h2>${city}</h2>
    <h3>${date}</h3>
    <p>Temperature: ${temperature}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    `);

    $('#current-weather').append(currentWeather);

    //get current UVI 
    var lat = data.city.coord.lat;
    var lon = data.city.coord.lon;
    var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(uviURL).then(function(response) {
        if (response.ok) {
            console.log(response) 
            response.json().then(function(uvi){
                console.log(uvi);
                var uvIndex = uvi.value;
                var currentUvi = $(`
                <p>UV Index: ${uvIndex}</p>
                `);

                //Append UVI
                $('#current-weather').append(currentUvi);
            })
        } else {
            alert('Error in UVI function');
        }
    })
    



    console.log(city);
    console.log(date);
    console.log(temperature);
    console.log(humidity);
    console.log(windSpeed);
}

var storeData = (city) => {
    //get previous searches
    var getStoredData = localStorage.getItem('Searched Cities');
    var citiesArr;
    console.log(getStoredData);

    //if there are no previous searches, then create empty array
    if (getStoredData === null) {
        citiesArr = []
    //if there are previous searches, then retrieve them
    } else {
        citiesArr = JSON.parse(getStoredData)
    }

    citiesArr.push(city);
    console.log(city);

    //stringify array to store in local storage
    var citiesArrString = JSON.stringify(citiesArr);
    //store array into storage
    window.localStorage.setItem('Searched Cities', citiesArrString);
}

//Capture user input
searchBtn.addEventListener("click", function () {
    event.preventDefault();
    var city = cityEl.value;

    //If there is no input then send an alert
    if (city === '') {
        alert('Please, enter a city.');
        return;
    }
    console.log(city);
    getLocation(city);
    storeData(city);
})
