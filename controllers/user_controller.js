var models = require ('../models/models.js');

// MW que permite acciones solamente si el usuario objeto 
// corresponde con el usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next) {
	var objUser = req.user.id;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if (isAdmin || objUser === logUser) {

		next ();

	} else {
		res.redirect('/');
	}
};

// Autoload :userId

exports.load = function(req, res, next, userId) {
	models.User.find({ where: { id: Number(userId)}})
	.then(function(user){
		if (user) {
			req.user = user;
			next();
		} else{next(new Error('No existe el usuario: '+userId))}
	}
	).catch(function(error){next(error)});
};

// Comprueba si el usuario esta registrado en la tabla de users
// Si la autenticación falla o hay errores se ejecuta callback(error).

exports.autenticar = function (login, password, callback) {
	models.User.find({
		where: {
			username: login
		}
	}).then(function(user) {
		if (user) {
			if (user.verifyPassword(password)) {
					callback(null, user);
			} else { callback(new Error('Contraseña Incorrecta.'));}
		} else { callback(new Error('No existe el Usuario=' + login))}
	}).catch(function(error){callback(error)});
};

// GET /user

exports.new = function(req, res) {
	var user = models.User.build( //Crea objeto usuario
		{username: "", password: ""}
	);
	res.render('user/new', {user: user, errors: []});
};

// POST /user

exports.create = function(req, res) {
	var user = models.User.build(req.body.user);

	user
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('user/new', {user: user, errors: err.errors});
			} else { //.save guarda en DB los campos username y password
				user.save({fields: ["username","password"]}) 
				.then( function(){

					req.session.user = {id:user.id, username: user.username};
					res.redirect('/');
				});
			}
		}
	).catch(function(error){next(error)});
};




// GET /user/:id/edit

exports.edit = function(req, res) {
	res.render('user/edit', {user: req.user, errors: []}); 
};			// req.user: instancia de usuario cargada con el autoload

// PUT /user/:id

exports.update = function(req, res) {
	req.user.username = req.body.user.username;
	req.user.password = req.body.user.password;

	req.user
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
			} else {
				req.user
				.save( {fields: ["username", "password"]})
				.then( function(){ res.redirect('/');});
			}
		}
	).catch(function(error){next(error)});
};


// DELETE /user/:id

exports.destroy = function(req, res) {

	// req.user.destroy({username:req.params.id, pass: req.params.password}, function (err) {
		// if (err) {
			//res.send('Error al intentar eliminar al usuario')
		//} else {
			// delete req.session.user;
			// res.redirect('/');
		//}
	//}).catch(function(error){next(error)});
// };
	
	req.user.destroy().then( function() { // Borra la sesión y redirige a /
		delete req.session.user;
		res.redirect('/');
	}).catch(function(error){next(error)});
};
/*
var users = { admin: {id:1, username:"admin",	password:"1234"},
			  pepe:  {id:2, username:"pepe",	password:"1234"},
			  Jesus: {id:3,	username:"Jesus",	password:"admin"}
			};

// Comprueba si el usuario esta registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error).

exports.autenticar = function (login, password, callback) {
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]);
		}
		else { callback(new Error('Password incorrecto.')); }
	} else { callback(new Error('No existe el usuario.'));}
};
*/
