const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = "https://api.darksky.net/forecast/d29c484faf7760bd59394d7f937f57ac/" + latitude +"," + longitude;
  request({ url: url, json: true }, (err, response) => {
    if(err){
      callback("Unable to connect to weather service!", undefined);
    }else if(response.body.error){
      callback("Unable to find location", undefined);
    }else{
      callback(undefined, {
        currently: response.body.currently,
        daily: response.body.daily,
        weatherString: response.body.daily.data[0].summary + " It is currently " + response.body.currently.temperature + " Degrees out. There is a " + response.body.currently.precipProbability + "% chance of rain"
      });
    }
  });
}

module.exports = forecast;