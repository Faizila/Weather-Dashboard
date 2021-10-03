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