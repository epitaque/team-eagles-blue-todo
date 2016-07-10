(function(){
    var User    = require('./models/UserModel');
    var Todo    = require('./models/TodoModel');

    module.exports = {

        // Generic Error Handler used by all endpoints
        handleError: function handleError(res, reason, message, code) {
            console.log("ERROR " + reason);
            res.status(code || 500).json({"error": message});
        },

        // User Authentication
        //   - Simply checks if user is logged in
        handleAuth: function handleError(req, res, next){
            if(!req.session.user_id){
                res.json({error: "You need to login to do that."});
            } else { 
                next();
            }
        },

        // Login Authenticaion
        //   - Check if username is taken
        //   - If username not taken, check username & password match
        handleLoginAuth: function handleLoginAuth(res, loginUser, user){
            if( !user ){
                res.json({error: "That username is not registered."});
            } else {
                if ( user.password === loginUser.password ) { 
                    return true
                } else {
                    res.json({error: 'Username and password do not match.'});
                }
            }
        },

        // USERNAME and EMAIL validation
        //   - Check if username and email are taken
        handleNewuserAuth: function handleError(req, res, next) {
            var newUser = new User(req.body.newUser);

            if ( newUser.username.length < 1 || newUser.email.length < 1) {
                res.json({error: 'Please enter a username and email.'});
            }

            User.find({"username": newUser.username}, (err, users) => {
                if (err) {
                    this.handleError(res, err.message, 
                        'Error while finding user with that username.');
                }

                if( users.length > 0 ) {
                    res.json({error: "Username is already taken."});
                } else {
                    User.find({"email": newUser.email}, (err, users) => {
                        if (err) {
                            this.handleError(res, err.message, 
                                'Error while finding user with that email.');
                        }

                        if( users.length > 0 ) {
                            res.json({error: "Email is already in use."});
                        } else {
                            next();
                        }
                    });
                }
            });
        }
    }
})();