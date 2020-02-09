const yargs = require("yargs");
const geocode = require("./utils.js/geocode");
const forcast = require("./utils.js/forcast");

yargs.command({
  command: 'weather',
  describe: 'Find the weather for a location',
  builder: {
    location:{
      describe: 'Location',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv){
    if(argv.location){
      geocode(argv.location, (err, data) => {
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
    }else{
      console.log("No location provided!");
    }
  }
});

yargs.parse();



