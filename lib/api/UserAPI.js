(function(){
    var express       = require('express');
    var router        = express.Router();
    var session       = require('express-session');
    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User          = require('../models/UserModel');
    var mw            = require('../middleware.js');
    var mailer        = require('express-mailer');

    module.exports = function(app){

        // Mailer config
        mailer.extend(app, {
            from: 'no-reply@BlueEaglesInc.com',
            host: 'smtp.gmail.com', // hostname 
            secureConnection: true, // use SSL 
            port: 465, // port for secure SMTP 
            transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
            auth: {
                user: 'gmail.user@gmail.com',
                pass: 'userpass'
            }
        });

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
                if(err){
                    mw.handleError(res, err.message, 'Cannot find User.');
                    return;
                }
                
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
                if(err){
                    mw.handleError(res, err.message, 'Failed to add new User.');
                    return;
                }
                res.json(newUser);
            });
        });

        router.get('/logout', function(req, res){
            console.log("Logging out");
            req.session.destroy(function(err){
                if(err){
                    mw.handleError(res, err.message, 'Failed to end session.');
                    return;
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
        router.get('/self', function(req, res){
            var userId = req.session.user_id;

            if(userId){
                User.findById(userId, (err, user) => {  
                    if(err){
                        mw.handleError(res, err.message, 'Cannot find User.');
                        return;
                    }
                    res.json(user);
                })
            }
        })

        router.post('/self', function(req, res){
            var userId = req.session.user_id;
            var userEmail = req.body.user.email;
            var updateUser = req.body.user;
            console.log("updating user 1");

            if(userId && updateUser) {
                console.log("updating user");
                User.findOneAndUpdate({"_id": userId}, updateUser, {upsert: false}, (error, user) => {
                    if (error) {
                         mw.handleError(res, err.message, 'Email is not in database.');
                         return;
                    }
                    res.json(user);
                });
            } else if(false && userEmail) { 
                User.findOne({"email": userEmail}, (err, user) => {
                    user.password = "1234";
                    user.save( err => {
                        if(err) res.json({"message": "User was not saved."});
                        // Send email saying password is now 1234
                        app.mailer.send('email', {
                            to: userEmail, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                            subject: 'Your password has been reset', // REQUIRED. 
                            otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
                        }, function (err) {
                            if (err) {
                                mw.handleError(res, err.message, 'Failed to send email.');
                                return;
                            }
                            res.json({"message": "An email has been sent."});
                        });
                    })
                });
            } else {
                res.json({"message": "You need to be logged in to do that."});
            }
        });

        app.use('/', router);
    }
})();