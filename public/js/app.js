const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
var dailyData;

weatherForm.addEventListener('submit', (event)=>{
  event.preventDefault();
  messageOne.textContent = "Gathering data please wait..";

  fetch("/weather?address="+ search.value).then((response)=>{
    response.json().then((data)=>{
      if(data.error){
        messageOne.textContent = data.error;
      }else{
        messageOne.textContent = '';
        dailyData = data.daily;
        weeklyHandler(dailyData);
        console.log(data.currently)
        dailyHandler(data.location, data.currently)
      }
    })
  })
})

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
  document.getElementById("forecast__container").style.display = "block";
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