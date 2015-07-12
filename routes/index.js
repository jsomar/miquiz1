var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET author */
router.get('/author', function(req, res){
	res.render('author', {credito: 'Autor'});
});

/* LLamada al controlador para mostrar la pregunta y la respuesta. */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
/*router.get ('/author/author', quizController.author)*/

module.exports = router;
