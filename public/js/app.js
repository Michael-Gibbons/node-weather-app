const weatherForm = document.querySelector('form');
const errMsg = document.querySelector('#errMsg');
const loader = document.querySelector('.loader');
const searchForm = document.querySelector('#searchForm');
var dailyData;


weatherForm.addEventListener('submit', (event)=>{
  event.preventDefault();
  loader.style.display = "block";
  document.getElementById("forecast__container").style.display = "none";
  weatherForm.style.display = "none";

  fetch("/weather?address="+ search.value).then((response)=>{
    response.json().then((data)=>{
      if(data.error){
        errMsg.textContent = data.error;
      }else{
        setTimeout(function(){
           loader.style.display = "none";
           dailyData = data.daily;
           weeklyHandler(dailyData);
           console.log(data.currently)
           dailyHandler(data.location, data.currently)
           document.activeElement.blur();
        }, 500);
      }
    });
  });
})
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
    console.log("/weather-quick?latitude="+ position.coords.latitude + "?longitude=" + position.coords.longitude)
    fetch("/weather-quick?latitude="+ position.coords.latitude + "&&longitude=" + position.coords.longitude).then((response)=>{
      response.json().then((data)=>{
        if(data.error){
          errMsg.textContent = data.error;
        }else{
          loader.style.display = "block";
          document.getElementById("forecast__container").style.display = "none";
          weatherForm.style.display = "none";
          setTimeout(function(){
             loader.style.display = "none";
             dailyData = data.daily;
             weeklyHandler(dailyData);
             console.log(data.currently)
             dailyHandler(data.location, data.currently)
             document.activeElement.blur();
          }, 500);
        }
      });
    });
    });
    

  } else { 
    console.log("geolocation not supported");
  }
}
function unixToDay(timestamp, abbr){
  if(abbr){
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 
  }else{
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  } 
  return days[new Date(timestamp * 1000).getDay()];
}
function unixToHour(timestamp){
  var time = new Date(timestamp);
  return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}
function weeklyHandler(data){
  var htmlTemplate = '';
  data.data.forEach(function(day){
    htmlTemplate = htmlTemplate + `
    <div class="forecast__day-container">
      <div class="forecast__day-title">${unixToDay(day.time, true)}</div>
      <img class="forcast__day-icon" src="img/${day.icon}.svg">
      <div class="forcast__day-highlow">
        <span class="forcast__day-high">${Math.round(day.temperatureMax)}&#176;</span> 
        <span class="forcast__day-low">${Math.round(day.temperatureMin)}&#176;</span>
      </div>
    </div>`
  });
  document.getElementById("forecast").innerHTML = htmlTemplate;
  $("#forecast__container").fadeIn();
  $(".search-again").fadeIn();
};

function dailyHandler(location, data){
  var htmlTemplate = `
    <div>
      <div class="forcast-single-day-location">${location}</div>
      <div class="forcast-single-day-data">${unixToDay(data.time, false)} ${unixToHour(data.time)}</div>
      <div class="forcast-single-day-data">${data.summary}</div>
      <div style="display:flex; align-items: center;">
        <img class="forcast__day-large-icon" src="img/${data.icon}.svg">
        <div class ="forcast__day-current-temp">${Math.round(data.temperature)}&#176;</div>    
      </div>
    </div>
  `;
  document.getElementById("forecast-single-day").innerHTML = htmlTemplate;
}
$(".search-again").click(function(){
  $("#forecast__container").fadeOut();
  $(".search-again").fadeOut(500, function(){
    $("form").fadeIn();
  });
  
  
});

getLocation();