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
    
    var apiUrL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&contd=&appid=${apiKey}`;

    fetch(apiUrL).then(function(response) {
        if (response.ok) {
            console.log(response) 
            response.json().then(function(data){
                console.log(data);
                displayCurrentWeather(data);
                displayFutureWeather(data);
            })
        } else {
            alert('Error in getWeather function');
        }
    })
}


var displayCurrentWeather = (data) => {
    // Clear old content
    $('#current-weather').empty();
    $('#current-weather').removeClass('display-forecast');

    // City info
    var city = data.city.name
    var date = moment().format('MMMM DD, YYYY')
    var temperature = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;

    //Icon representing weather conditions
    var icon = data.list[0].weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${icon}.png`;
    var iconDes = data.list[0].weather[0].description;

    var currentWeather = $(`
    <h2>${city} <img src="${iconURL}" alt="${iconDes}" /></h2>
    <h3>${date}</h3>
    <p><b>Temperature:</b> ${temperature}°F</p>
    <p><b>Humidity:</b> ${humidity}%</p>
    <p><b>Wind Speed:</b> ${windSpeed} MPH</p>
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
                <p id="uv-index"><span><b>UV Index:</b> ${uvIndex}</span></p>
                `);

                //Append UVI
                $('#current-weather').append(currentUvi);
                $('#current-weather').addClass('display-forecast');
                    if (uvIndex < 3) {
                        console.log("favorable");
                        $('#uv-index').addClass('uvi-low');
                    } else if (uvIndex >= 3 && uvIndex < 6) {
                        console.log("moderate");
                        $('#uv-index').addClass('uvi-mod');
                    } else if (uvIndex >= 6 && uvIndex <= 12) {
                        console.log("severe");
                        $('#uv-index').addClass('uvi-sev');
                    } else {
                        console.log('error in UV Index function');
                    }
            })
        } else {
            alert('Error in UVI function');
        }
    })
    
}

var displayFutureWeather = (data) => {
    // Clear old content
    $('#future-weather').empty();

    //loop through data to get 5-day information
    for (let i = 1; i < 46; i = i + 8) {
        //i=1 because i=0 is today's weather and not future weather. 
        //i = i+8 because each day includes 8 3 hour forecasts
        //i<46 because I want to display 5 days. 5*9 = 45. 45+1 = 46
        var futureWeather = {
            date: data.list[i].dt_txt,
            icon: data.list[i].weather[0].icon,
            temp: data.list[i].main.temp,
            wind: data.list[i].wind.speed,
            humidity: data.list[i].main.humidity
        }
        console.table(futureWeather);
        //display content
        console.log(futureWeather.date);
        console.log(futureWeather.temp);

        var futureWeatherHTML = $(`
        <div class="card">
            <h5 class="card-title">${futureWeather.date} <img src="${iconURL}" alt="${iconDes}"</h5>
            <p>Temperature: ${futureWeather.temp}</p>
            <p>Wind Speed: ${futureWeather.speed}</p>
            <p>Humidity: ${futureWeather.humidity}</p>
        </div>
    `);

        }
        $('#future-weather').append(futureWeatherHTML);
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

    //Add city to previous searches if it is not there
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
  