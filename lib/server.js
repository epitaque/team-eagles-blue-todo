import express from 'express';
import mongoose from 'mongoose';
const app      = express();
const port     = process.env.PORT || 8080;
const ip       = process.env.IP;

// Mongoose Config
mongoose.connect('mongodb://jchang4:blueEagle@ds017193.mlab.com:17193/node-todo-demo');

// Express Config
app.set('view engine', 'ejs');

// Import API and Models
var TodoApi = require('../api/TodoAPI');
var Todo = require('../models/TodoModel');
// Initialize TodoApi
TodoApi(app);

// Seed Database
var seedDB = require('../seedDB')
// seedDB(app);    // comment out so I dont run it every time server starts

app.get('*', (req, res) => {
    res.send("You've reached the 'Other' Route! Congrats! Now go back.");
});

app.listen(port);
