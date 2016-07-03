(function(){
    var mongoose = require('mongoose');
    var Todo     = require('./TodoModel')

    var userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Todo'
            }
        ]
    })

    module.exports = mongoose.model('User', userSchema);

})();