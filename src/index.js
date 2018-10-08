const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const app = express();
// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json()); // used for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-unlencoded
app.use(cors());


// Routes
app.use('/search',require('./routes/search'));

// Static files
app.use(express.static(__dirname + '/public'));

// Start server listening on port 3000
app.listen(app.get('port'), ()=> {
  console.log('Server on port ', app.get('port'));
})
