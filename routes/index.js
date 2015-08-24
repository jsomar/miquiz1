var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statisticsController = require('../controllers/statistics_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

/* GET author */
router.get('/author', function(req, res){
	res.render('author', {credito: 'Autor', errors: []});
});

/* LLamada al controlador para mostrar la pregunta y la respuesta. */
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);
//router.get ('/author/author', quizController.author)

// Autoload de comandos con Ids
router.param('quizId', 		quizController.load);		// autoload :quizId
router.param('commentId', 	commentController.load); 	// autoload :commentId
router.param('userId', 		userController.load);		// autoload :userId	

// Definición de rutas de sesion
router.get('/login',			sessionController.new);			// Formulario de login
router.post('/login',			sessionController.create);		// Crear sesión
router.get('/logout',			sessionController.destroy);		// Destruir sesión

// Definición de rutas de cuenta /user
router.get('/user',							userController.new);			// Formulario de registro sign in
router.post('/user',						userController.create);			// Registrar usuario
router.get('/user/:userId(\\d+)/edit',		sessionController.loginRequired, 
											userController.ownershipRequired, 
											userController.edit);
router.put('/user/:userId(\\d+)',			sessionController.loginRequired, 
											userController.ownershipRequired,
											userController.update);
router.delete('/user/:userId(\\d+)',		sessionController.loginRequired, 
											userController.ownershipRequired, 
											userController.destroy);
router.get('/user/:userId(\\d+)/quizes', 	quizController.index);

//Definición de rutas de preguntas /quizes
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create',				sessionController.loginRequired,
											multer({ dest:'./public/media/'}),
											quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired,
											quizController.ownershipRequired,
											quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired, 
											quizController.ownershipRequired,
											multer({ dest:'./public/media/'}),
											quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired,
											quizController.ownershipRequired, 
											quizController.destroy);


//Definición de rutas /comments
router.get('/quizes/:quizId(\\d+)/comments/new',						commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',							commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 	sessionController.loginRequired, 
																		commentController.ownershipRequired, 
																		commentController.publish);

//Definición de rutas /statistics

router.get('/quizes/statistics', /*sessionController.loginRequired,*/ statisticsController.index);

//router.get('/quizes/statistics', statisticsController.index);

module.exports = router;

//router.delete('/quizes/:quizId(\\d+)/comments',
//	sessionController.loginRequired, commentController.destroy);



