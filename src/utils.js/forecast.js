const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = "https://api.darksky.net/forecast/d29c484faf7760bd59394d7f937f57ac/" + latitude +"," + longitude;
  request({ url: url, json: true }, (err, responseF) => {
    if(err){
      callback("Unable to connect to weather service!", undefined);
    }else if(responseF.body.error){
      callback("Unable to find location", undefined);
    }else{
      const url = "https://api.darksky.net/forecast/d29c484faf7760bd59394d7f937f57ac/" + latitude +"," + longitude + "?units=si";
      request({ url: url, json: true }, (err, responseC) => {
        if(err){
          callback("Unable to connect to weather service!", undefined);
        }else if(responseC.body.error){
          callback("Unable to find location", undefined);
        }else{
          callback(undefined, {
            currently: responseF.body.currently,
            daily: responseF.body.daily,
            currentlyC: responseC.body.currently,
            dailyC: responseC.body.daily
          });
        }
      });
    }
  });
}

module.exports = forecast;