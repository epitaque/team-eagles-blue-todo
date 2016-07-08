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
                res.send(req.user);
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

        // *********************************************************
        // Finish later 
        // *********************************************************
        router.get('/logout', function(req, res){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                } else {
                    // not sure what to do after logging out
                    res.redirect('/login')
                }
            })
        });
        
        // *********************************************************
        // Used for Development to see current list of
        //   Users
        // *********************************************************
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