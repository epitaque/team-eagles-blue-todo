var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var path	   = require('path');
var config     = require('./config');
const UserApi  = require('./api/UserApi');
const TodoApi  = require('./api/TodoAPI');
var port       = process.env.PORT || 8080;
var ip         = process.env.IP;

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


app.listen(port, ip, function(){
    console.log("Listening on port " + port);
});
