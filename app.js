var express = require('express');
var app = express();
var port = 3000;
var swig = require("swig");
var bodyParser = require('body-parser');

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

// HTTP body parsing (JSON or URL-encoded) middleware
  // We include both of these so we can parse the two major kinds of bodies
  // HTML forms default to a URL encoded body
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

var server = app.listen(port,function(){
	console.log("Listening on port: ",port);
})


app.use(function(req,res,next){
	
	res.on('finish',function(){
		console.log("Method: ",req.method,"Path: ", req.path,"Status Code: ", res.statusCode)
	})
	next();
});

app.get("/", function(req, res, next) {
	res.render('index');
});

app.use(express.static(__dirname + "/public"));