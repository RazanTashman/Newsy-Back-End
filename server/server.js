var express = require('express');
var bodyParser = require('body-parser');
var authroute = require('./auth.js')
var db = require('./db');
var app = express();
var cors = require('cors');

var route = require('./resources/newsyRouter.js');
app.use(cors());
//UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client/dist'));
app.use(bodyParser.json()); //So the text input from the client side can be read by the server.
app.use('/', authroute);
app.use('/', route.newsyRouter);

// app.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*"); 
//   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
//    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS"); 
//    res.setHeader("X-Powered-By",' 3.2.1');
//     res.setHeader("Content-Type", "application/json;charset=utf-8");
//     res.setHeader("Access-Control-Allow-Credentials","true");

//   next();
// })

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('listening on port: ' + port);
});
module.exports = app;

