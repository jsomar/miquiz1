var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('miquiz1'));
app.use(session(/*{ secret: 'miquiz1', cookie: { maxAge: 120000 }}*/));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {

	// guarda path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}

	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

// Auto-logout de session
app.use(function(req, res, next) {
    if (req.session.user) {
        if (Date.now() - req.session.user.lastRequestTime > 1*60*1000) {
        delete req.session.user;
    } else {
        req.session.user.lastRequestTime = Date.now();
    }
 }
    next();
});

/* Auto-logout con el uso de app.use(session())
app.use(function(req, res, next) {
    var sess = req.session;
    var tiempo = 120000;
    var tiemposesion = new Date().getTime();

    if (sess && sess.lastAccess) {

        var vidasesion = tiempo - req.session.lastAccess;

        if (tiempo <= vidasesion) {

            delete req.session.user;

        } 
      }
      sess.lastAccess = tiemposesion; 
      next();
    
});
*/



app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;



/*
app.use())


En session_controller.js, cuando creo una sesión añado un nuevo campo (lastRequestTime):

exports.create = ...
 req.session.user = { id: user.id, username: user.username, lastRequestTime: Date.now() };


Luego en app.js añado este middelware:

app.use(function(req, res, next) {
 if (req.session.user) {
 if (Date.now() - req.session.user.lastRequestTime > 1*60*1000) {
 delete req.session.user;
 } else {
 req.session.user.lastRequestTime = Date.now();
 }
 }
 next();
});


*/
