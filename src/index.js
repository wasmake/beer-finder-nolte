const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const app = express();
// Settings of our backend
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev')); // used to get more log over the console
app.use(bodyParser.json()); // used for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-unlencoded
app.use(cors());


// Setting the controller route of the API
// the main route will be '/search', feel free
// to change it.
app.use('/search',require('./routes/search'));

// Making our /public folder static and 'Public'
app.use(express.static(__dirname + '/public'));

// Start the server listening on port 3000
app.listen(app.get('port'), ()=> {
  console.log('Server on port ', app.get('port'));
})
