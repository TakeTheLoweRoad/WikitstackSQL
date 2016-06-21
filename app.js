'use strict;'

var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var swig = require( 'swig');
var path = require( 'path' );
var pg = require( 'pg');
var pgHstore = require( 'pg-hstore');
var Sequelize = require( 'sequelize' );
var models = require('./models');

var app = express();

// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res, next){
	res.render('./public/index.html');
});


models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);