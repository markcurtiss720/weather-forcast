$(document).ready(function() {
  //when search button clicked, check if any input is entered and run functions to set weather and forcast.
  $("#search-btn").on("click", function(event) {
    var searchCity = $('#city').val();
    if(!searchCity) {
      alert("Please enter a city")
      return
    }
    $('#city').val("");
    setWeather(searchCity);
    setForecast(searchCity);
  });
  
  
  //pulls searches from loacal storage
  var cityHistory = JSON.parse(localStorage.getItem("history")) || [];
  
  //sets history to correct length
  if(cityHistory.length > 0) {
    setWeather(cityHistory[cityHistory.length - 1]);
  }
  
  //makes a li for each item in history array
  for (var i = 0; i < cityHistory.length; i++) {
    historyList(cityHistory[i]);
  }
  
  //puts searched cities into history
  function historyList(data) {
    var list = $("<li>").addClass("list-group-item").text(data);
    $(".history").append(list);
  }
  

  $(".history").on("click", "li", function() {
    setWeather($(this).text());
    setForecast($(this).text());
  });
  
  //pulls data and displays cities current temperature
  function setWeather(searchCity) {
    var cityApi = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=da723ed68c8cd034dc24c28586e335a4&units=imperial"
    fetch(cityApi) 
        .then(function (response) {
            return response.json();
            })
        .then(function (data) {
            console.log("City objects")
            console.log(data)

          if (cityHistory.indexOf(searchCity) === -1) {
            cityHistory.push(searchCity);
            localStorage.setItem("history", JSON.stringify(cityHistory));
            historyList(searchCity)
            }

            $("#weather-today").empty();
            var title = $("<h3>").addClass("card-title").text(data.name + " " + dayjs().format("ddd D-MMM") )
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
            var wind = $("<p>").addClass("card-text").text("Wind Speed " + data.wind.speed + " MPH");


            $("#weather-today").append(card);
            card.append(cardBody)
            cardBody.append(title, temp, humidity, wind);
            title.append(img)
        })
  }

//pulls data and creates 5 cards with the forcast for the city
  function setForecast (searchTerm) {
    var forecastApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=da723ed68c8cd034dc24c28586e335a4&units=imperial"
    fetch(forecastApi) 
        .then(function (response) {
            return response.json();
            })
        .then(function (data) {
            console.log("forcast")
            console.log(data)
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {

              if(data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                var dateTime = data.list[i].dt_txt;
                var datejs = dayjs(dateTime).format("ddd D-MMM")
                console.log(datejs)

                var column = $("<div>").addClass("col-md-2")
                var title = $("<h3>").addClass("card-title").text(datejs)
                var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body p-2");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " F");
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + " %");
                var wind = $("<p>").addClass("card-text").text("Wind Speed " + data.list[i].wind.speed + " MPH");

                column.append(card)
                card.append(cardBody)
                cardBody.append(title, img, temp, humidity, wind)

                $("#forecast .row").append(column)
              }

            } 
          })
  }
})
  
