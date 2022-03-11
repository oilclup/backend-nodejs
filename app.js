const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const errorHandler = require('./middleware/errorHandler')

const app = express();

app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern_api', {
    useNewUrlParser : true,
    useUnifiedTopology: false
}).then(() => {
    console.log('Connect MongonDB');
}).catch((err)=> console.log(err))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', usersRouter);

app.use(errorHandler)

module.exports = app;
