// Declarations
const weatherForm = $('form');
const errMsg = $('#errMsg');
const loader = $('.loader');

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
}

function cToF(celsius){
  return Math.round(celsius * 9 / 5 + 32);
}

function fToC(fahrenheit){
  return Math.round((fahrenheit - 32) * 5 / 9);
}


// Weather Functions
function showWeather(daily, location, currently){
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
  data.data.forEach(function (day) {
    htmlTemplate = htmlTemplate + `
    <div class="forecast__day-container">
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
  var htmlTemplate = `
    <div>
      <div class="forcast-single-day-location">${location}</div>
      <div class="forcast-single-day-data">${unixToDay(data.time, false)} ${unixToHour(data.time)}</div>
      <div class="forcast-single-day-data">${data.summary}</div>
      <div style="display:flex; align-items: center;">
        <img class="forcast__day-large-icon" src="img/${data.icon}.svg">
        <div class ="forcast__day-current-temp unitTemp">${Math.round(data.temperature)}&#176;</div>
        <div class="tempChange__container">
          <a id="F" class="tempChange tempChange-active" href="#">F&#176;</a> | <a id="C" class="tempChange" href="#">C&#176;</a>
        </div>    
      </div>
    </div>
  `;
  document.getElementById("forecast-single-day").innerHTML = htmlTemplate;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      fetch("/weather-quick?latitude=" + position.coords.latitude + "&&longitude=" + position.coords.longitude).then((response) => {
        response.json().then((data) => {
          if (data.error) {
            errMsg.text( data.error );
          } else {
            showWeather(data.daily,data.location, data.currently);
          }
        });
      });
    });
  } else {
    console.log("geolocation not supported");
  }
}


// Animations
$(".search-again").click(function () {
  $("#forecast__container").fadeOut();
  $(".search-again").fadeOut(500, function () {
    $("form").fadeIn();
  });
});


// Main Proccess
getLocation();
weatherForm.on('submit', (event) => {
  event.preventDefault();
  showLoaderHideElse()

  fetch("/weather?address=" + search.value).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        errMsg.text(data.error);
      } else {
        showWeather(data.daily,data.location, data.currently);
      }
    });
  });
});
$("#forecast-single-day").on("click", ".tempChange", function(){
  if($(this).attr('id') == 'F' && ! $(this).hasClass( "tempChange-active")){
    $(".unitTemp").each(function(){
      temp = parseInt(this.innerHTML.replace(/\D/g,''));
      this.innerHTML = cToF(temp) + '&#176;';
    });
  }else if($(this).attr('id') == 'C' && ! $(this).hasClass( "tempChange-active")){
    $(".unitTemp").each(function(){
      temp = parseInt(this.innerHTML.replace(/\D/g,''));
      this.innerHTML = fToC(temp) + '&#176;';
    });
  }
  $(".tempChange").removeClass( "tempChange-active" );
  $(this).addClass( "tempChange-active");
})

