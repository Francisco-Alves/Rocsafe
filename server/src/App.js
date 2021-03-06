const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var mongoose = require('mongoose');
var usersRouter = require('./routes/users');
var missionsRouter = require('./routes/missions');

//Json file with server ip and port
var serverData = require('./serverData');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/missions', missionsRouter);

mongoose.connect('mongodb://test:test@ds229909.mlab.com:29909/rocsafe');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

//Notify when connected
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to DB');
	app.db = db;
});

app.listen(process.env.PORT || serverData.port, serverData.ip || '127.0.0.1');
