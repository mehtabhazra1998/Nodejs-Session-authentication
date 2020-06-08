var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose =require('mongoose');
const Dishes=require('./models/dishes');
var FileStore=require('session-file-store')(session);
const url='mongodb://localhost:27017/confusion';
const connect =mongoose.connect(url);
var app = express();





connect.then((db)=>{
	console.log('Connected correctly to Server');

},(err)=>{console.log(err);});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
	name:'session-id',
	secret:'12345-67890-09876-54321',
	saveUnintialized:false,
	resave:false,
	store:new FileStore()

}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth (req, res, next) {
  console.log(req.session);
  if(!req.session.user)
  {
   	
 	      var err = new Error('You are not authenticated!');
 	      res.redirect('/');
 	      err.status = 403;
 	      // next(err);
 	      // return;
 	  
  }
  else{
  	if(req.session.user==='Authenticated'){
  		next();
  	}
  	else
  	{
  		var err = new Error('You are not authenticated!');
 	          
 	    err.status = 403;
 	    next(err);
 	    return ;
  	}
  }
  
}

app.use(auth);
 
// function auth(req,res,next)
// {
// 	console.log(req.headers);
// 	var authHeader=req.headers.authorization;
// 	res.setHeader('WWW-Authenticate','Basic');
// 	if(!authHeader)
// 	{
// 		var err=new Error('You are not authenticated!');
// 		res.setHeader('WWW-Authenticate','Basic');
// 		res.statusCode=401;
// 		return next(err);
// 	}
// 	var auth=new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
// 	var username=auth[0];
// 	var password=auth[1];
// 	if(username==='admin' && password==='password')
// 	{
// 		next();
// 	}
// 	else
// 	{
// 		var err=new Error('You are not authenticated!');
		
// 		res.statusCode=401;
// 		return next(err); 
// 	}

// }


app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
