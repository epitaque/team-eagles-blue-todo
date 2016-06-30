(function(){
    var mongoose = require('mongoose');
    var User     = require('./UserModel')

    var todoSchema = new mongoose.Schema({
        task: {
            type: String,
            required: true
        },
        completed: 'boolean',
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    });

    module.exports = mongoose.model('Todo', todoSchema);

})();