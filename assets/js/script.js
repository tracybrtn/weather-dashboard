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
            console.log(response) 
            response.json().then(function(data){
                console.log(data);
                // If no data comes back because the city does not exist
                if (data.length === 0) {
                    alert('Enter a valid city');
                }
                else {
                console.log(data[0].lon);
                console.log(data[0].lat);

                var lat = data[0].lat;
                var lon = data[0].lon;
                var city = data[0].name;
                
                getWeather(lat, lon)
                }
            })
        }
    })
}


//passes latitude, longitude, and city name
var getWeather = function(lat, lon) {
    
    var apiUrL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrL).then(function(response) {
        if (response.ok) {
            console.log(response) 
            response.json().then(function(data){
                console.log(data);
            })
        } else {
            alert('Error in getWeather function');
        }
    })
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
