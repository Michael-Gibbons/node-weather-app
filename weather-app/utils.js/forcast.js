const request = require("request");

const forcast = (latitude, longitude, callback) => {
  const url = "https://api.darksky.net/forecast/d29c484faf7760bd59394d7f937f57ac/" + latitude +"," + longitude;
  request({ url: url, json: true }, (err, { body }) => {
    if(err){
      callback("Unable to connect to weather service!", undefined);
    }else if(body.error){
      callback("Unable to find location", undefined);
    }else{
      callback(undefined, {
        currently: body.currently,
        weatherString: body.daily.data[0].summary + " It is currently " + body.currently.temperature + " Degrees out. There is a " + body.currently.precipProbability + "% chance of rain"
      });
    }
  });
}

module.exports = forcast;