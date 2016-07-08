// =========================================================
// NOTE: finish PUT request to edit todos
// =========================================================

(function(){
    var User    = require('../models/UserModel');
    var Todo	= require('../models/TodoModel');
    var express = require('express');
    var router  = express.Router();

    // Generic Error Handler used by all endpoints
    function handleError(res, reason, message, code) {
        console.log("ERROR " + reason);
        res.status(code || 500).json({"error": message});
    }

    module.exports = function(app){
        // "/todos" ROUTES
        // 
        // GET:    find all todos attached to this username
        // POST:   check if Todo exists, if not post new Todo
        // PUT:  
        // DELETE: delete todo reference from User.todos, 
        //         and deletes Todo itself from DB.
        router.get('/todo', function(req, res, next){
            var userId = req.session.user_id;
            // Check if user is logged in
            if( userId ){
                User.findById(userId)
                    .populate('todos')
                    .exec(function(error, user){
                        if (error) {
                            handleError(res, err.message, "Failed to get populated User.");
                        }

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
                    if(err) console.log(err);

                    user.todos.push(todo);
                    user.save( err => {
                        if(err) console.log(err);

                        // Save new Todo to DB
                        todo.save( err => {
                            if(err) console.log(err);
                        });

                        res.json(user);
                    });
                });

            }
        });

        // =================================================================
        // This will let you edit the COMPLETED and TASK props on the todo
        // =================================================================
        router.put('/todos', function(req, res){
            var userId = req.session.user_id;
            var todo     = req.body.todo;

            if( userId && todo ){
                User.findById(userId, (err, user) => {
                    if(err) console.log(err);

                    res.json(user.todos);
                });
            }
        });

        router.delete('/todos', function(req, res){
            var userId = req.session.user_id;
            var todo   = req.body.todo;

            if( userId && todo ){
                User.findById(userId, (err, user) => {
                    if(err) console.log(err);

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