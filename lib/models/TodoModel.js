(function(){
    var mongoose = require('mongoose');

    var todoSchema = new mongoose.Schema({
        task: {
            type: String,
            required: true
        },
        importance: [Number],
        completed: 'boolean'
    });

    module.exports = mongoose.model('Todo', todoSchema);

})();