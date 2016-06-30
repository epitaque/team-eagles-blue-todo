(function(){
    var mongoose = require('mongoose');

    var todoSchema = new mongoose.Schema({
        task: 'string',
        completed: 'boolean'
    });

    module.exports = mongoose.model('Todo', todoSchema);

})();