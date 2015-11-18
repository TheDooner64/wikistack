var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
var path = require('path');
var wikiRoutes = require('./routes/wiki.js');
var usersRoutes = require('./routes/users.js');
require('./filters')(swig);

// Default settings for Swig template engine
  // Set which function to use when rendering HTML
app.engine('html', swig.renderFile);
  // Render views using the "html" engine
app.set('view engine', 'html');
  // Set where views for are found for express' "res.render" command
app.set('views', __dirname + '/views');
  // Turn off default cache preferences for swig and express
app.set('view cache', false);
swig.setDefaults({ cache: false});

// logging middleware
app.use(morgan('dev'));

// HTTP body parsing (JSON or URL-encoded) middleware
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

// Serve up public directory of static files (i.e. CSS file)
app.use(express.static(__dirname + '/public'));

// Start server
var port = 3000;
var server = app.listen(port,function(){
	console.log('Listening on port: ',port);
});

// Sub routes
app.use('/wiki', wikiRoutes);
app.use('/users', usersRoutes);

// Render the index file at the root path
app.get('/', function(req, res, next) {
  res.render('index');
});

// error-handling middleware
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});