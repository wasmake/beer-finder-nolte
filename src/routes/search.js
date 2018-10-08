const express = require('express');
var request = require('request');
const config = require('../app/config.json');
var fuel_api_key = config.fuel_api_key;
var google_api_key = config.google_api_key;
var convert = require('xml-js');
const googleMapsClient = require('@google/maps').createClient({
  key: google_api_key
});

const router = express.Router();

// Get stock image to make it beauty
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

// Get fuel economy from a specific car
router.get('/car-eco/:year/:model/:make/:option', (req, res) => {
  var cyear = req.params.year;
  var cmodel = req.params.model;
  var cmake = req.params.make;
  var coption = req.params.option;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year='+cyear+'&make='+cmake+'&model='+cmodel, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    var carid = xmlThing.menuItems.menuItem[coption].value._text;
    request('https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/'+carid, function (error, response, body) {
      var xmlAvg = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
      var avg = xmlAvg.yourMpgVehicle.avgMpg._text;
      var kml = avg * 0.425144;
      var jsonavg = {"mpg": avg, "kml":kml};
      res.send(JSON.stringify(jsonavg));
    });
  });
});

// Get available years
router.get('/years', (req, res) =>{
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year', function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

// Get car-makers from that year
router.get('/make-year/:year', (req, res) =>{
  var cyear = req.params.year;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year='+cyear, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

// Get models from car-maker on that year
router.get('/model-make-year/:year/:make', (req, res) =>{
  var cyear = req.params.year;
  var cmake = req.params.make;
  request('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year='+cyear+'&make='+cmake, function (error, response, body) {
    var xmlThing = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    res.send(JSON.stringify(xmlThing.menuItems.menuItem));
  });
});

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

router.get('/geodest/:address1&dest=:address2', (req, res) =>{
  var add1 = unescape(encodeURIComponent(req.params.address1));
  var add2 = unescape(encodeURIComponent(req.params.address2));
  request('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+add1+'&destinations='+add2+'&key='+google_api_key, function (error, response, body) {
    res.send(JSON.parse(body));
  });
})

module.exports = router;
