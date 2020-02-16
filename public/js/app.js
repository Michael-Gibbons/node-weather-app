// Declarations
const weatherForm = $('form');
const errMsg = $('#errMsg');
const loader = $('.loader');
var Userlocation;
var weeklyDataF;
var weeklyDataC;
var currentlyDataF;
var currentlyDataC;
var currentUnits = 'F';
var clickedDay;

// Utility Functions
function unixToDay(timestamp, abbr) {
  if (abbr) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  } else {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  }
  return days[new Date(timestamp * 1000).getDay()];
}

function unixToHour(timestamp) {
  var time = new Date(timestamp);
  return time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

function showLoaderHideElse(){
  loader.show();
  $("forecast__container").hide();
  weatherForm.hide(); 
  errMsg.hide();
}

function getPercentage(num){
  return Math.round(num*100) + "%";
}

function errorHandler(error){
  loader.hide();
  $("form").fadeIn();
  errMsg.text(error);
  errMsg.fadeIn();
}

// Weather Functions
function showWeather(dailyF, dailyC, currentlyF, currentlyC, location){
  weeklyDataF = dailyF;
  weeklyDataC = dailyC;
  currentlyDataF = currentlyF;
  currentlyDataC = currentlyC;
  Userlocation = location;
  if(currentUnits == 'F'){
    currently = currentlyF;
    daily = dailyF;
  }else{
    currently = currentlyC;
    daily = dailyC;
  }
  showLoaderHideElse()
  setTimeout(function () {
    loader.hide();
    weeklyHandler(daily);
    dailyHandler(location, currently)
    document.activeElement.blur();
  }, 500);
}
function weeklyHandler(data) {
  var htmlTemplate = '';
  data.data.forEach(function (day, index) {
    var activeClass = "";
    if(index == clickedDay){
      activeClass = "forecast__day-container-active";
    }
    htmlTemplate = htmlTemplate + `
    <div class="forecast__day-container ${activeClass}" data-index=${index}>
      <div class="forecast__day-title">${unixToDay(day.time, true)}</div>
      <img class="forcast__day-icon" src="img/${day.icon}.svg">
      <div class="forcast__day-highlow">
        <span class="forcast__day-high unitTemp">${Math.round(day.temperatureMax)}&#176;</span> 
        <span class="forcast__day-low unitTemp">${Math.round(day.temperatureMin)}&#176;</span>
      </div>
    </div>`
  });
  document.getElementById("forecast").innerHTML = htmlTemplate;
  $("#forecast__container").fadeIn();
  $(".search-again").fadeIn();
};

function dailyHandler(location, data) {
  if(currentUnits == 'F'){
    var windUnits = "mph"
  }else{
    var windUnits = "kph"
  }
  
  var htmlTemplate = `
    <div>
      <div class="forcast-single-day-location">${location}</div>
      <div class="forcast-single-day-data">${unixToDay(data.time, false)} ${unixToHour(data.time)}</div>
      <div class="forcast-single-day-data">${data.summary}</div>
      <div style="display:flex; align-items: center; flex-wrap:wrap;">
        <img class="forcast__day-large-icon" src="img/${data.icon}.svg">
        <div class ="forcast__day-current-temp unitTemp">${Math.round(data.temperature || data.temperatureHigh)}&#176;</div>
        <div class="tempChange__container">
          <a id="F" class="tempChange" href="javascript:void();">F&#176;</a> | <a id="C" class="tempChange" href="javascript:void();">C&#176;</a>
        </div>
        <div class="forcast-single-day-data-rainchance__container">
          <div class="forcast-single-day-data-rainchance__item">
            <img class="forcast__day-small-icon" src="img/raindrops-solid.svg">
            <span class="forcast-single-day-data-rainchance">${getPercentage(data.precipProbability)}</span>
          </div>
          <div class="forcast-single-day-data-rainchance__item">
            <img class="forcast__day-small-icon" src="img/humidity-regular.svg">
            <span class="forcast-single-day-data-rainchance">${getPercentage(data.humidity)}</span>
          </div>
          <div class="forcast-single-day-data-rainchance__item">
            <img class="forcast__day-small-icon" src="img/wind.svg">
            <span class="forcast-single-day-data-rainchance unitWind">${Math.round(data.windSpeed)}${windUnits}</span>
          </div>
        </div>    
      </div>
    </div>
  `;
  document.getElementById("forecast-single-day").innerHTML = htmlTemplate;
  if(currentUnits == 'F'){
    $("#F").addClass("tempChange-active");
  }else{
    $("#C").addClass("tempChange-active");
  }
  
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      fetch("/weather-quick?latitude=" + position.coords.latitude + "&&longitude=" + position.coords.longitude).then((response) => {
        response.json().then((data) => {
          if (data.error) {
            errorHandler(data.error)
          } else {
            showWeather(data.daily,data.dailyC, data.currently, data.currentlyC, data.location);
          }
        });
      });
    });
  } else {
    console.log("geolocation not supported");
  }
}


// Animations and Listeners
$(".search-again").click(function () {
  $("#forecast__container").fadeOut();
  $(".search-again").fadeOut(500, function () {
    $("form").fadeIn();
  });
});

$("#forecast").on("click",".forecast__day-container", function(){
  $(".forecast__day-container").removeClass("forecast__day-container-active");
  $(this).addClass("forecast__day-container-active");
  clickedDay= $(this).data("index");
  
  if(currentUnits == 'F'){
    dailyHandler(Userlocation, weeklyDataF.data[clickedDay]);
  }else{
    dailyHandler(Userlocation, weeklyDataC.data[clickedDay]);
  }
  
});

$("#forecast-single-day").on("click", ".tempChange", function(){
  if($(this).attr('id') == 'F' && ! $(this).hasClass( "tempChange-active")){
    currentUnits = 'F';
    weeklyHandler(weeklyDataF);
    if(clickedDay != undefined){
      dailyHandler(Userlocation, weeklyDataF.data[clickedDay]);
    }else{
      dailyHandler(Userlocation, currentlyDataF);
    }
       
  }else if($(this).attr('id') == 'C' && ! $(this).hasClass( "tempChange-active")){
    currentUnits = 'C';
    weeklyHandler(weeklyDataC);
    if(clickedDay != undefined){
      dailyHandler(Userlocation, weeklyDataC.data[clickedDay]);
    }else{
      dailyHandler(Userlocation, currentlyDataC);
    } 
  }
})


// Main Proccess
getLocation();
weatherForm.on('submit', (event) => {
  event.preventDefault();
  showLoaderHideElse()

  fetch("/weather?address=" + search.value).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        errorHandler(data.error)
      } else {
        showWeather(data.daily,data.dailyC, data.currently, data.currentlyC, data.location);
      }
    });
  });
});


