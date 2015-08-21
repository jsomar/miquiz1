var path = require ('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user 		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol 	= (url[1]||null);
var dialect 	= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require ('sequelize');

// Usar BBDD SQLite o Postgre:
var sequelize = new Sequelize(DB_name, user, pwd,
						 {dialect: protocol,
						  protocol: protocol,
						  port: port,
						  host: host,
						  storage: storage, //solo SQLite (.env)
						  omitNull: true 	//Solo Posgres
						}
					);
// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment en comment.js
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Importar la definición de la tabla Users en user.js
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

// Relación de las tablas Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación de las tablas User y Quiz
Quiz.belongsTo(User);
User.hasMany(Quiz);


exports.Quiz = Quiz; 		// exportar definición de tabla Quiz
exports.Comment = Comment; 	// exportar definición de tabla Comment
exports.User = User; 		// exportar definición de la tabla User

//sequelize.sync() crea e inicializa tabla de usuarios en DB
sequelize.sync().then(function(){
	// then(..) ejecuta el manejador una vez creada la tabla
	User.count().then(function (count){
		User.bulkCreate(
			[
				{username: 'admin', password: '1234', isAdmin: true},
				{username: 'Jesus', password: 'admin', isAdmin: true},
				{username: 'pepe',	password: '5678'}
			]
			).then(function(){
				console.log('Base de datos usuarios inicializada');
				Quiz.count().then(function (count){
					if (count === 0) { // la tabla se inicializa solo si está vacia
						Quiz.bulkCreate(
						[
							{pregunta: '¿Capital de Italia?', 	
							 respuesta: 'Roma', 
							 tema: 'Humanidades',
							 UserId: 3},

							{pregunta: '¿Capital de Portugal?',
							 respuesta: 'Lisboa', 
							 tema: 'Humanidades', 
							 UserId: 3}
						]
					).then(function(){console.log('Base de datos Quizzes inicializada')});
				};
			});	
		});
	});
});
