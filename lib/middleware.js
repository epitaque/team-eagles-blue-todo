(function(){
    var User = require('./models/UserModel');
    var Todo = require('./models/TodoModel');

    module.exports = {
        // Generic Error Handler used by all endpoints
        handleError(res, reason, message, code) {
            console.log("ERROR " + reason);
            res.status(code || 500).json({"error": message});
        },

        // User Authentication
        //   - Simply checks if user is logged in
        handleAuth(req, res, next){
            if(!req.session.user_id){
                res.send("You need to login to do that.")
            } else { 
                next();
            }
        },

        // USERNAME and EMAIL validation
        //   - Check if username and email are taken
        handleNewuserAuth(req, res, next) {
            var newUser = new User(req.body.newUser);

            if ( newUser.username.length < 1 || newUser.email.length < 1) {
                res.send('Please enter a username and email.');
            }

            User.find({"poop": newUser.username}, (err, users) => {
                if (err) {
                    this.handleError(res, err.message, 'Failed to add new user.');
                }

                if( users.length > 0 ) {
                    res.send("Username is already taken.");
                } else {
                    User.find({"email": newUser.email}, (err, users) => {
                        if (err) {
                            this.handleError(res, err.message, 'Failed to add new user.');
                        }

                        if( users.length > 0 ) {
                            res.send("Email is already in use.");
                        } else {
                            next();
                        }
                    });
                }
            });
        }
    }
})();