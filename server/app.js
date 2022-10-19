var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');         //parse cookie (which we are getting from client)
var logger = require('morgan');                     //user which action performed(eg:history)
var cors=require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var db=require('./database/db');
var model=require('./models/User');


var app = express();

app.use(logger('dev'));                           //register the logs
app.use(express.json());                         //similar to bodyparser             
app.use(express.urlencoded({ extended: false }));       
app.use(cookieParser());                        //to read cookie from client
app.use(express.static(path.join(__dirname, 'public')));  //to create public folder so that images and other file can access via url 
app.use(cors({
  origin: '*'
}));
app.use('/',indexRouter);
app.use('/users', usersRouter);
// app.use(cors());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// const myLogger = function (req, res, next) {
//   console.log('LOGGED')
//   next()
// }

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(5000, function () {
  console.log('Example app listening on port ' + 5000 + '!');
});

module.exports = app;
