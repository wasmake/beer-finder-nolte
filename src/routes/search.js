const express = require('express');
var request = require('request');
const config = require('../app/config.json');
var fuel_api_key = config.fuel_api_key;
var google_api_key = config.google_api_key;
var convert = require('xml-js');

// Loading google API with the key
const googleMapsClient = require('@google/maps').createClient({
  key: google_api_key
});

const router = express.Router();

// Our search.js file is our route tracer for our API
// if you want to change the main route of the API look
// for the import at the index file over the /src/ directory

// Get stock image from fuel api to make the website
// Looks amazing
// @param year is the year of the car
// @param model is the model of the car
// @param make is the maker of the car
// @return just image url
router.get('/car-image/:year/:model/:make', (req, res) => {
  var cyear = req.params.year;
  var cmodel = req.params.model;
  var cmake = req.params.make;
  request('https://api.fuelapi.com/v1/json/vehicles/?year='+cyear+'&model='+cmodel+'&make='+cmake+'&api_key='+fuel_api_key, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var json = JSON.parse(body);
    request('https://api.fuelapi.com/v1/json/vehicle/'+json[0].id+'/?api_key='+fuel_api_key+'&productID=1', function(error, response, body){
      var ijson = JSON.parse(body);
      res.send(ijson.products[0].productFormats[1].assets[0].url);
    });
  });
});

// Get fuel economy average from a specific car
// @param year is the year of the car
// @param model is the model of the car
// @param make is the maker of the car
// @param option is equipment of the car, usually option 0
// @return just a JSON with mpg average and kml
router.get('/car-eco/:year/:model/:make/:option', (req, res) => {
  var cyear = req.params.year;
  var cmodel = req.params.model;
  var cmake = req.params.make;
  var coption = req.params.option;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year='+cyear+'&make='+cmake+'&model='+cmodel, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    console.log(xmlThing);
    if(error || xmlThing == null || xmlThing.menuItems == null || xmlThing.menuItems.menuItem == null || xmlThing.menuItems.menuItem[coption] == null) {
      res.send({"error":"Cant retrive Km/l Avg"});
    } else {
      var carid = xmlThing.menuItems.menuItem[coption].value._text;
      request('https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/'+carid, function (error, response, body) {
        var xmlAvg = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
        if(error || xmlAvg.yourMpgVehicle.avgMpg == null) {
          res.send({"error":"Cant retrive Km/l Avg"});
        } else {
          console.log(xmlAvg);
          var avg = xmlAvg.yourMpgVehicle.avgMpg._text;
          var kml = avg * 0.425144;
          var jsonavg = {"mpg": avg, "kml":kml};
          res.send(JSON.stringify(jsonavg));
          }
      });
    }

  });
});

// Get available years from the Fuel Economy API
// @return a JSON full of Years
router.get('/years', (req, res) =>{
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year', function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

// Get car-makers from that year
// @param year is the year of the car
// @return a JSON full of Makers
router.get('/make-year/:year', (req, res) =>{
  var cyear = req.params.year;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year='+cyear, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

// Get models from car-maker on that year
// @param year is the year of the car
// @param make is the maker of the car
// @return a JSON full of car models
router.get('/model-make-year/:year/:make', (req, res) =>{
  var cyear = req.params.year;
  var cmake = req.params.make;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year='+cyear+'&make='+cmake, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

// Get the current location of the user based on coordinates
// @param pos should be lat,lng formatted
// @return a JSON with the formatted adress
router.get('/geolocation/:pos', (req, res) =>{
  var pos = req.params.pos;
  request('https://maps.googleapis.com/maps/api/geocode/json?latlng='+pos+'&key='+google_api_key, function (error, response, body) {
    var json = JSON.parse(body);
    var parsj = {
      "address" : json.results[0].formatted_address
    }
    res.send(parsj);
  });
});

// Get data from the Google Maps API from a trip between
// Origin and destination
// @param address1 is the origin of the trip
// @param address2 is the destination of the trip
// @return a JSON with a lot of data from the trip
router.get('/geodest/:address1&dest=:address2', (req, res) =>{
  var add1 = unescape(encodeURIComponent(req.params.address1));
  var add2 = unescape(encodeURIComponent(req.params.address2));
  request('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+add1+'&destinations='+add2+'&key='+google_api_key, function (error, response, body) {
    res.send(JSON.parse(body));
  });
});

module.exports = router;
