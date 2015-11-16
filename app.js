var express = require('express');
var app = express();
var port = 3000;

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
	res.status(200).send("Hello world");
});