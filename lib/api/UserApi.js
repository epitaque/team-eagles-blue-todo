(function(){
    var User = require('../models/UserModel');

    // Generic Error Handler used by all endpoints
    function handleError(res, reason, message, code) {
        console.log("ERROR " + reason);
        res.status(code || 500).json({"error": message});
    }

    module.exports = function(app){

        // Body-Parser Config
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        
        // '/login' ROUTES
        // 
        // POST: find user with given username
        app.route('/login')
            .post(function(req, res){
                console.log("user trying to log in:", req.body.username);
                User.find({'username': req.body.username}, function(err, user){
                    if(err) { 
                        handleError(req, err.message, 
                            'Failed to find user with that username.'); 
                    }
                    else if(user) {
                        var user_ = {
                            username: user[0].email,
                            email: user[0].email
                        }
                        console.log("success: sending back: ", user_)
                        res.json(user_);
                    }
                });
            })
        
        // '/signup' ROUTES
        // 
        // POST: create new user
        app.route('/signup')
            .post(function(req, res){
                var newUser = new User(req.body);
                newUser.save(function(err){
                    if(err) {
                        handleError(res, err.message, 
                            'Failed to add new user.'); 
                    }
                    else {
                       res.json({username: newUser.username,
                              email: newUser.email })
                    }
                });
            });

        // Used for Development to see current list of
        //   Users
        app.route('/users')
            .get(function(req, res){
                User.find({})
                    .exec(function(err, users){
                        if(err) {
                            console.log(err);
                        }
                        res.json(users);
                    })
            })
    }
})();