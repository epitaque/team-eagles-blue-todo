(function(){
    var express = require('express');
    var router  = express.Router();
    var User    = require('../models/UserModel');
    var mw      = require('../middleware.js');

    module.exports = function(app){

        // Body-Parser Config
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        
        // '/login' ROUTES
        // 
        // POST: send loginUser
        router.post('/login', (req, res) => {
            var loginUser = req.body.loginUser

            // Find User with matching USERNAME and PASSWORD
            User.find({
                "username": loginUser.username,
                "password": req.body.loginUser.password })
                .exec( (err, user) => {
                    if (err) {
                        mw.handleError(req, err.message, 
                            'We could not match that username and password. Please try again.')
                    }
                    res.send(user);
                });
            })
        
        // '/signup' ROUTES
        // 
        // POST: create new User
        router.post('/signup', (req, res, next) => {
            mw.handleNewuserAuth(req, res, next)
        }, (req, res, next) => {
            // USERNAME and EMAIL are available
            // Create new User
            var newUser = new User(req.body.newUser);
            newUser.save( (err) => {
                if(err) {
                    mw.handleError(res, err.message, 
                        'Failed to add new user.');
                }
                res.redirect('/users')
            });
        });

        // Used for Development to see current list of
        //   Users
        router.get('/users', (req, res) => {
            User.find({}, (err, users) => {
                if(err) {
                    console.log(err);
                }
                res.json(users);
            })
        })

        app.use('/', router);
    }
})();