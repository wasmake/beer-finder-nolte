const express = require('express');
const morgan = require('morgan');
const app = express();
// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/search',require('./routes/search'));

// Static files
app.use(express.static(__dirname + '/public'));

// Start server listening on port 3000
app.listen(app.get('port'), ()=> {
  console.log('Server on port ', app.get('port'));
})
