var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var models = require('../models');
var Page = models.Page; 
var User = models.User;

Page.hook('beforeValidate', function(page){
	if (page.title){
		page.urlTitle = generateUrlTitle(page.title);
	} else {
		page.urlTitle = Math.random().toString(36).replace(/[^a-z]+/g, '')
		.substr(0, 5);
	}
})

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

router.use(bodyParser.urlencoded({ extended: true}));

router.use(bodyParser.json());

router.get('/add/', function (req, res, next){
	res.render('addpage');
})

router.get('/users/:authorId', function (req, res, next) {
  User.findOne({ 
    where: { 
      authorId: req.params.authorId 
    } 
  })
  .then(function(foundAuthor){
      res.render('wikipage', {page: foundAuthor});
      //incomplete
  })
  .catch(next);

});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
      res.render('wikipage', {page: foundPage});
  })
  .catch(next);

});

router.get('/', function (req, res, next){
	res.redirect('/');
})

router.post('/', function(req, res, next) {

  var formObj = req.body;
  var thisTitle = formObj.title;
  var thisContent = formObj.content;
  var status = formObj.page_status;
  var thisAuthor = formObj.author_name;
  var authorEmail = formObj.author_email;

  User.findOrCreate({
    where: {
      name: thisAuthor,
      email: authorEmail
    }
  })
  .then(function(values){

    var user = values[0];

    var page = Page.build({
      title: thisTitle,
      content: thisContent,
      status: status
    });

    return page.save()
      .then(function (thisPage) {
        return thisPage.setAuthor(user);
      })

  })
  .then(function(savedPage){
     // res.redirect('/');
     res.redirect(savedPage.route)
  })
  .catch(next);
  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.

  
  // -> after save -> res.redirect('/');
});

module.exports = router;
