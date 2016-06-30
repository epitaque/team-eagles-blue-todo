var express  = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var ip       = process.env.IP;

// Mongoose Config
mongoose.connect('mongodb://jchang4:blueEagle@ds017193.mlab.com:17193/node-todo-demo');

// Expose node-modules and NG2 code
console.log(__dirname);
app.use('/node_modules', express.static(__dirname + '/node_modules'))
app.use(express.static('client'));

// Import API and Models
var TodoApi = require('./api/TodoAPI');
var Todo = require('./models/TodoModel');
// Initialize TodoApi
TodoApi(app);

// Seed Database
var seedDB = require('./seedDB')
// seedDB(app);    // comment out so I dont run it every time server starts

app.get('/', (req, res) => {
    res.sendFile('client/index.html');
});

app.listen(port);