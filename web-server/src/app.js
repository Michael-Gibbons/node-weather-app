const path = require('path');
const express = require('express');
const hbs = require('hbs');

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
  res.send("View Weather");
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