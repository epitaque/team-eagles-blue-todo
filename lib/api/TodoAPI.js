(function(){
    var User    = require('../models/UserModel');
    var Todo	= require('../models/TodoModel');
    var express = require('express');
    var router  = express.Router();

    // Generic Error Handler used by all endpoints
    function handleError(res, reason, message, code) {
        console.log("ERROR " + reason);
        res.sendStatus(code || 500).json({"error": message});
    }

    module.exports = function(app){
        // "/todos" ROUTES
        // 
        // GET:    find all todos attached to this username
        // POST:   check if Todo exists, if not post new Todo
        // PUT:    edit Todos if user is logged in
        // DELETE: delete todo reference from User.todos, 
        //         and deletes Todo itself from DB.
        router.get('/todo', function(req, res, next){
            var userId = req.session.user_id;
            // Check if user is logged in
            if(userId){
                User.findById(userId)
                    .populate('todos')
                    .exec( (err, user) => {
                        if (err) {
                            handleError(res, err.message, "Failed to get populated User.");
                        }
                        console.log("Sending todos", user.todos);
                        res.json(user.todos);
                    });
            } else {
                res.json({"message": "You need to log in to do that."});
            }
        });

        router.post('/todo', function(req, res, next){
            var userId   = req.session.user_id;
            var todo     = req.body.newTodo;

            if( userId && todo ){
                todo = new Todo(todo);

                // Push new Todo to user.todos
                User.findById(userId, (err, user) => {
                    if(err) {
                        handleError(res, err.message, "Failed to get populated User.");
                        return;
                    }

                    user.todos.push(todo);
                    user.save( err => {
                        if(err) {
                            handleError(res, err.message, "Failed to save User to DB.");
                            return;
                        }
                        // Save new Todo to DB
                        todo.save( err => {
                            if(err) { handleError(res, err.message, "Failed to save Todo to DB."); }
                            else {
                                res.json({message: "Successfully posted todo."});
                            }
                        });
                    });
                });

            }
        });

        router.put('/todo', function(req, res){

            var userId = req.session.user_id;
            var todo   = req.body.todo;

            if( userId && todo ){
                Todo.findOneAndUpdate({"_id": todo._id}, todo, {upsert: true}, (err, todo) => {
                    User.findOne({"username": userId})
                        .populate('todos')
                        .exec( (err, user) => {
                            console.log("sending response");
                            res.json(user.todos);
                        });
                });
            }
        });

        router.post('/deletetodo', function(req, res){
            var userId = req.session.user_id;
            var todo   = req.body.todo;

            if( userId && todo ){
                User.findById(userId, (err, user) => {
                    if(err) {
                        handleError(res, err.message, "Failed to find User in DB.");
                    }

                    // delete todo from user.todos
                    var index = user.todos.indexOf(todo._id);
                    user.todos.splice(index, 1);

                    // delete Todo from DB
                    Todo.findById(todo._id)
                        .remove()
                        .exec( (err, data) => {
                            if(err) console.log(err);
                        });
                    // Save User data
                    user.save( err => {
                        if(err) console.log(err);
                        res.json(user);
                    });
                })
            }
        });


        app.use('/', router);
    }
})();