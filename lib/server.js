var express  = require('express');
var mongoose = require('mongoose');
var path	 = require('path');
var config   = require('./config');
var app      = express();
var port     = process.env.PORT || 8080;
var ip       = process.env.IP;

// Mongoose Config
mongoose.connect(config.db.mongodb);

// Expose node-modules and NG2 code
console.log(__dirname);
console.log(path.resolve(__dirname + '/../node_modules'));
app.use('/node_modules', express.static(path.resolve(__dirname + '/../node_modules')));
app.use(express.static('client'));

// Import API and Models
var UserApi = require('./api/UserApi');
var TodoApi = require('./api/TodoAPI');

// Initialize APIs
UserApi(app);
TodoApi(app);

// Seed Database
var seedDB = require('./seedDB')
// seedDB(app);    // comment out so I dont run it every time server starts

app.get('*', (req, res) => {
    var angularAppRoute = path.resolve(__dirname + '/../client/index.html');
    res.sendFile(angularAppRoute);
});

(() => {
    app.listen(port);
    console.log("Listening on port " + port);
})();