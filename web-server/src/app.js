const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forcast = require("./utils.js/forcast");
const geocode = require("./utils.js/geocode");

const app = express();

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
    forcast(data.latitude, data.longitude, (err, forcastData) => {
      if(err){
        return res.send({error: err});
      }
      res.send({
        forcast: forcastData.weatherString,
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

app.listen(3000, () => {
  console.log("Server is now up on port 3000");
})