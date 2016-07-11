(function(){
    var express       = require('express');
    var router        = express.Router();
    var User          = require('../models/UserModel');
    var mw            = require('../middleware.js');

    module.exports = function(app){

        // Body-Parser Config
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // /userManagement
        // 
        // GET: 
        // POST: 
        // PUT: 
        // DELETE: 
        router.get('/userManagement', function(req, res){
            var wantsAccess = req.session.user_id;

            var wantsAccess = req.headers.user; // make this a user._id
            if(wantsAccess){
                User.findById(wantsAccess, (err, user) => {
                    if(err) mw.handleError(res, err.message, 'Cannot find user information.');
                    if(user.admin !== true){
                        res.json({"message": "Sorry, you are not an admin."});
                    } else {
                        // Send all the Users with populated todos
                        User.find({})
                            .populate('todos')
                            .exec( (err, users) => {
                                if(err) {
                                    mw.handleError(res, err.message, 
                                    'Failed to grab all users.');
                                }
                                res.json(users);
                            });           
                    }
                });
            }
        });

        app.use('/', router);
    };
})();