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
        // GET: find user with given username
        app.route('/login')
            .get(function(req, res){
                User.find({'username': req.body.username}, function(err, user){
                    if(err) { 
                        handleError(req, err.message, 
                            'Failed to find user with that username.'); 
                    }
                    res.json(user);
                });
            })
        
        // '/signup' ROUTES
        // 
        // POST: create new user
        app.route('/signup')
            .post(function(req, res){
                var newUser = new User(req.body.newUser);
                newUser.save(function(err){
                    if(err) { 
                        handleError(res, err.message, 
                            'Failed to add new user.'); 
                    };
                    res.redirect('/users');
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