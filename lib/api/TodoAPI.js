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
        router.get('/todos', function(req, res, next){
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
                res.send('You need to log in to do that.');
            }
        });

        router.post('/todos', function(req, res, next){
            var username = req.headers.username;
            var todo     = req.body.newTodo;

            if( username && todo ){
                todo = new Todo(todo);

                // Push new Todo to user.todos
                User.findOne({"username": username}, (err, user) => {
                    if(err) console.log(err);

                    user.todos.push(todo);
                    user.save( err => {
                        if(err) console.log(err);

                        // Save new Todo
                        todo.save( err => {
                            if(err) console.log(err);
                        });

                        res.json(user);
                    })
                });

            }
        });

        // =================================================================
        // This will let you edit the COMPLETED and TASK props on the todo
        // =================================================================
        router.put('/todos', function(req, res){
            var username = req.headers.username;
            var todo     = req.body.todo;

            if( username && todo ){
                User.findOne({"username": username}, (err, user) => {
                    if(err) console.log(err);

                    res.send(user.todos);
                });
            }
        });

        router.delete('/todos', function(req, res){
            var username = req.headers.username;
            var todo     = req.body.todo;

            if( username && todo ){
                User.findOne({"username": username}, (err, user) => {
                    if(err) console.log(err);

                    // delete todo from user.todos
                    var index = user.todos.indexOf(todo._id);
                    user.todos = user.todos.splice(index, 1);
                    

                    // delete todo from Todo on Mongoose
                    Todo.findById(todo._id)
                        .remove()
                        .exec( (err, data) => {
                            if(err) console.log(err);
                        })

                    res.send(user);
                })
            }
        });


        app.use('/', router);
    }
})();