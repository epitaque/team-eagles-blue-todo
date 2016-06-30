(function(){
    var mongoose = require('mongoose');
    var Todo     = require('./models/TodoModel')

    module.exports = function(app){
        var seedTodos = [
            {
                newTodo: {
                    task: "create a working API using Node and Express",
                    completed: false
                }
            },
            {
                newTodo: {
                    task: "create models for users, todos, and associate the two",
                    completed: false
                }
            },
            {
                newTodo: {
                    task: "create user authentication",
                    completed: false
                }
            },
            {
                newTodo: {
                    task: "add ability to comment on other people's accounts?",
                    completed: false
                }
            },
            {
                newTodo: {
                    task: "other stuff I have to do that I haven't thought of yet",
                    completed: false
                }
            }
        ];

        seedTodos.map(function(todo){
            todo = todo.newTodo;
            var newTodo = new Todo(todo);
            newTodo.save(function(err){
                if(err) { console.log(err); }
            });
        });
    };
})();