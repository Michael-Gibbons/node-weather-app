const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require("./utils.js/forecast");
const geocode = require("./utils.js/geocode");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars, engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: "Weather App",
    name: "Michael Gibbons"
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: "About Me",
    name: "Michael Gibbons"
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: "This is a help message",
    title: "Help",
    name: "Michael Gibbons"
  });
});
app.get('/help/*', (req, res) => {
  res.render('404', {
    errMsg: "HELP ARTICLE NOT FOUND",
    title: "404",
    name: "Michael Gibbons"
  });
});

app.get('/weather', (req, res) => {
  if(!req.query.address){
    return res.send({error: "You must provide an address"});
  }
  geocode(req.query.address, (err, data) => {
    if(err){
      return res.send({error: err});
    }
    forecast(data.latitude, data.longitude, (err, forecastData) => {
      if(err){
        return res.send({error: err});
      }
      res.send({
        forecast: forecastData.weatherString,
        location: data.location,
        address: req.query.address
      });
    });
  });
});


app.get('*', (req, res) => {
  res.render('404', {
    errMsg: "404 NOT FOUND",
    title: "404",
    name: "Michael Gibbons"
  });
});

app.listen(port, () => {
  console.log("Server is now up on port" + port);
});