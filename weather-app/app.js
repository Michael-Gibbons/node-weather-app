
const geocode = require("./utils.js/geocode");
const forcast = require("./utils.js/forcast");

const address = process.argv[2]

if(!address){
  console.log("Please provide an address");
}else{
  geocode(address, (err, data) => {
    if(err){
      return console.log(err);
    }
    forcast(data.latitude, data.longitude, (err, forcastData) => {
      if(err){
        return console.log(err);
      }
      console.log(data.location);
      console.log(forcastData.weatherString);
    });
  });
}


