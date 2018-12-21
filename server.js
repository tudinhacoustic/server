const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//Connect Routes
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles')
const app = express()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS
app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', 'http://tu-api.herokuapp.com');
    //  res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
     next();
});


const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then(()=>console.log('MongoBD Connected'))
  .catch((err)=>console.log('ERR: '+err))
//Passport Middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);
//Use Routes
app.use('/api/users', users);
app.use('/api/profiles', profiles)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error('Not Found');
  error.status = 404;
  nest(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
	 error: {
		 message: 'Page Not Found'
	 }
  });
})
const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Sever is running on port ${port}`));
