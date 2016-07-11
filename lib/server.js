var express   = require('express');
var app       = express();
var mongoose  = require('mongoose');
var path	  = require('path');
var config    = require('./config');
var port      = process.env.PORT || 8080;
var ip        = process.env.IP;
const UserApi = require(path.resolve(__dirname + '/api/UserApi'));
const TodoApi = require(path.resolve(__dirname + '/api/TodoAPI'));


// Mongoose Config
mongoose.connect(config.db.mongodb);

// Expose node-modules and NG2 code
console.log(__dirname);
console.log(path.resolve(__dirname + '/../node_modules'));
app.use('/node_modules', express.static(path.resolve(__dirname + '/../node_modules')));
app.use(express.static(path.resolve(__dirname + '/../client')));

// Initialize APIs
UserApi(app);
TodoApi(app);

app.get('*', (req, res) => {
    var angularAppRoute = path.resolve(__dirname + '/../client/index.html');
    res.sendFile(angularAppRoute);
});

(() => {
    app.listen(port);
    console.log("Listening on port " + port);
})();