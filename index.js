var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Promise = require('bluebird');
    
process.env.TZ = 'America/New_York';

var fbPageDAO = require('./dao/fb-page-dao.js');

var users = [];
  
mongoose.Promise = Promise; 
mongoose.connect('mongodb://localhost/project-detective');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'));
app.use(express.static('./public'));

require('./facebook-auth-service')(passport);

app = require("./routes")(app);

app.listen(process.env.PORT, function (server) {
   console.log('server listening on ' + process.env.PORT); 
});