var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* LLamada al controlador para mostrar la pregunta y la respuesta. */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
