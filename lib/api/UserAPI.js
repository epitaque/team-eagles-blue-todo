(function(){
    var express       = require('express');
    var router        = express.Router();
    var session       = require('express-session');
    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User          = require('../models/UserModel');
    var mw            = require('../middleware.js');

    module.exports = function(app){

        // Body-Parser Config
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

// **************************************************************
// Still figuring out if I want to use this or the one I made
        // Session Config
        app.use(session({
            secret: 'BlueEaglesGo'
        }))
        var sess;

        // PassportJS Config
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new LocalStrategy(
            {
                usernameField: 'loginUser[username]',
                passwordField: 'loginUser[password]'
            },
            function(username, password, done){
                User.findOne({"username": username}, (err, user) => {
                    if( !user || user.password !== password ) {
                        return done(null, false, { message: 'Username and password do not match.'});
                    }
                    done(null, user);
                });
            }
        ));

        passport.serializeUser(function(user, done){
            done(null, user._id);
        });
        passport.deserializeUser(function(id, done){
            User.findById(id)
                .exec((err, user) => {
                    if(err) console.log(err);

                    done(null, user); // passed as req.user
                });
        })

        router.post('/login2', 
            passport.authenticate('local'), 
            function(req, res){
                res.json(req.user);
        });

// **************************************************************

        // '/login' ROUTES
        // 
        // POST: send loginUser
        router.post('/login', (req, res) => {
            sess = req.session;
            var loginUser = req.body.loginUser;
            User.findOne({"username": loginUser.username}, (err, user) => {
                if(err) console.log(err);
                
                // If middleware true, send data
                if( mw.handleLoginAuth(res, loginUser, user) ){
                    sess.user_id = user._id;
                    res.json(user);
                }
            });
        });
        
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
                res.json(newUser);
            });
        });

        router.get('/logout', function(req, res){
            console.log("Logging out");
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                } else {
                    res.json({message: "Successfully logged out!"});
                }
            })
        });
        
        // '/self' ROUTE
        // 
        // POST: updates the User's password/resets it;
        //       lets you log in via email to get password,
        //         if you forget login.
        router.post('/self', (req, res) => {
            var userId = req.session.user_id;
            var userEmail = req.body.user.email;
            var updateUser = req.body.user;

            if(userId && updateUser) {
                User.findOneAndUpdate({"_id": userId}, updateUser, {upsert: false}, (error, user) => {
                        if (error) mw.handleError(res, err.message, 'Email is not in database.');
                        res.json({"message": "Updated user!"});
                    });

            } else if(userEmail && updateUser) { 
                User.findOne({"email": userEmail}, (err, user) => {
                    for(var prop in user){ 
                        if(updateUser[prop] && prop !== "_id"){
                            user[prop] = updateUser[prop];
                        }
                    }
                    user.save( err => {
                        if(err) res.json({"message": "User was not saved."});
                    });
                    res.json(user)
                });
            } else {
                res.json({"message": "You need to be logged in to do that."});
            }
        });


        // *********************************************************
        // Used for Development to see current list of
        //   Users
        // *********************************************************
        router.get('/users', (req, res) => {
            // User.find({}, (err, users) => {
            User.find({})
                .populate('todos')
                .exec( (err, users) => {
                    if(err) {
                        mw.handleError(res, err.message, 
                          'Failed to grab all users.');
                    }
                    res.json(users);
                });
            });

        app.use('/', router);
    }
})();