(function(){
    var Todo = require('../models/TodoModel');

    // Generic Error Handler used by all endpoints
    function handleError(res, reason, message, code) {
        console.log("ERROR" + reason);
        res.status(code || 500).json({"error": message});
    }

    module.exports = function(app){

        // Body-Parser Config
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // "/" ROUTES
        // 
        // GET: find all todos
        // POST: check if Todo exists, if not post new Todo
        app.get('/', function(req, res){
            Todo.find({}, function(err, todos){
                if (err) {
                    handleError(res, err.message, "Failed to get contacts.");
                }
                res.json(todos);
            });
        });

        app.post('/', function(req, res){
            var newTodo = new Todo(req.body.newTodo);
            newTodo.save(function(err){
                if(err) return handleError(err);
            });
            res.redirect('/')
        });
    }
})();