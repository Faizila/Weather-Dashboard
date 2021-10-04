$(document).ready(function () {
  $("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    // clear input box
    $("#search-value").val("");
    searchWeather(searchValue);
  });

  $(".history").on("click", "button", function () {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var button = $("<button>").addClass("list-group-item").text(text);
    $(".history").append(button);
  }

  function searchWeather(searchValue) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchValue +
        "&appid=37aadd8d7062f6279bc5143441946c82&units=imperial",
      dataType: "json",
      success: function (data) {
        // create history links for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));

          makeRow(searchValue);
        }

        // clear old content
        $("#today").empty();

        // create html tags for current weather
        var cardHeader = $("<div>").addClass("card-header");
        $("#today").append(cardHeader);

        var cardBodyDiv = $("<div>").addClass("card-body border");

        // current weather card
        var currentPlace = $("<span>").text(
          data.name + ", " + data.sys.country
        );
        cardHeader.append(currentPlace);
        var newDate = moment().format(" (M/D/YYYY) ");
        cardHeader.append(newDate);
        // icon
        var iconURL =
          "http://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          "@2x.png";
        var icon = $("<img src='" + iconURL + "'>");
        cardHeader.append(icon);
        // temp
        var temp = data.main.temp;
        var pTemp = $("<p>")
          .addClass("pl-2 pt-2")
          .text("Temperature: " + temp.toFixed(1) + " °F");
        cardBodyDiv.append(pTemp);
        // wind
        var windSpeed = data.wind.speed;
        var pWindSpeed = $("<p>")
          .addClass("pl-2 pt-2")
          .text("Wind Speed: " + windSpeed.toFixed(2) + " MPH");
        cardBodyDiv.append(pWindSpeed);
        // humidity
        var humidity = data.main.humidity;
        var pHumidity = $("<p>")
          .addClass("pl-2 pt-2")
          .text("Humidity: " + humidity + "%");
        cardBodyDiv.append(pHumidity);

        // merge and add to page
        $("#today").append(cardBodyDiv);

        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      },
    });
  }
  // call API
  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchValue +
        "&appid=37aadd8d7062f6279bc5143441946c82&units=imperial",
      dataType: "json",
      success: function (data) {
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast:<h4>')
          .append('<div class="row">');

        // loop over all forecasts
        for (var i = 0; i < data.list.length; i++) {
          // only looks at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for cards
            var col = $("<div>").addClass("col-md-2");

            var card = $("<div>").addClass("card bg-dark text-white");

            var body = $("<div>").addClass("card-body p-2");
            // card title
            var title = $("<h5>")
              .addClass("card-title")
              .text(new Date(data.list[i].dt_txt).toLocaleDateString());
            //weather icon
            var img = $("<img>").attr(
              "src",
              "http://openweathermap.org/img/wn/" +
                data.list[i].weather[0].icon +
                ".png"
            );
            // Temp
            var p1 = $("<p>")
              .addClass("card-text")
              .text("Temp: " + data.list[i].main.temp.toFixed(1) + " °F");
            // Wind
            var p2 = $("<p>")
              .addClass("card-text")
              .text("Wind: " + data.list[i].wind.speed.toFixed(2) + " MPH");
            //  Humidity
            var p3 = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and append on page
            col.append(card.append(body.append(title, img, p1, p2, p3)));

            $("#forecast .row").append(col);
          }
        }
      },
    });
  }

  // UV Index data
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=37aadd8d7062f6279bc5143441946c82&lat=" +
        lat +
        "&lon=" +
        lon,
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").addClass("pl-2 pt-2").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);

        // loop for UV Index color change depending on UV value
        if (data.value <= 2) {
          btn.css("background-color", "green");
        } else if (data.value <= 5) {
          btn.css("background-color", "yellow");
        } else if (data.value <= 7) {
          btn.css("background-color", "orange");
        } else if (data.value <= 10) {
          btn.css("background-color", "red");
        } else if (data.value <= 50) {
          btn.css("background-color", "purple");
        }

        $("#today .card-body").append(uv.append(btn));
      },
    });
  }

  // get history list
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
