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
var wikiRouter = require('./routes/wiki');
var models = require('./models');
var Page = models.Page; 
var User = models.User;

var app = express();

app.use(morgan('dev'));
app.use('/wiki', wikiRouter);

// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res, next){
	Page.findAll({attributes: ['title', 'urlTitle']})
	.then(function(allTheThings){
	res.render('index', {pages: allTheThings})
})
	.catch(next);
});

app.get('/users', function(req, res, next){
	User.findAll({attributes: ['name']})
	.then(function(obj){
		res.render('users', {users: obj})
	})
	.catch(next);
})


models.User.sync({ force: true })
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);