const request = require("request");

const geocode = (address, callback) => {
  const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiY2F2ZW1hbnh4MTMweCIsImEiOiJjazZlZHdpNHMwYXFxM25wNjh3MDlqbmk5In0.6r3PhVd1bEMX28h7Uj25xA&limit=1";
  request({ url: url, json: true }, (err, response) => {
    if(err){
      callback("Unable to connect to location service!", undefined);
    }else if(response.body.features.length === 0){
      callback("Unable to find location. Try another search.", undefined);
    }else{
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name
      });
    }
  });
}

module.exports = geocode;