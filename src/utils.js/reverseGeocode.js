const request = require("request");

const reverseGeocode = (long, lat, callback) => {
  const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + long + ","+ lat + ".json?access_token=pk.eyJ1IjoiY2F2ZW1hbnh4MTMweCIsImEiOiJjazZlZHdpNHMwYXFxM25wNjh3MDlqbmk5In0.6r3PhVd1bEMX28h7Uj25xA&limit=1";
  request({ url: url, json: true }, (err, response) => {
    if(err){
      callback("Unable to connect to location service!", undefined);
    }else if(response.body.features.length === 0){
      callback("Unable to find location. Try another search.", undefined);
    }else{
      callback(undefined, {
        location: response.body.features[0].place_name
      });
    }
  });
}

module.exports = reverseGeocode;