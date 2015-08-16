var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function (req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else { next(new Error('No existe comentario=' + commentId))}

		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new

exports.new = function(req, res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};


// POST /quizes/:quizId/comments

exports.create = function(req, res) {
	var comment = models.Comment.build(
		{ 
			texto: req.body.comment.texto,
			QuizId: req.params.quizId

		});
	comment.validate().then(
		function(err) {
			if(err) {
				res.render('comments/new.ejs',
				{comment: comment, quizid: req.params.quizId, errors: err.errors});
		} else {
			comment.save().then( function(){ res.redirect('/quizes/'+req.params.quizId)})
		}

		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizesId/comments/:commentId/publish
exports.publish = function (req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	.then(function(){res.redirect('/quizes/'+req.params.quizId);})
	.catch(function(error){next(error)}); 
};

/* DELETE quizes/:quizId(\\d+)/comments/:commentId(\\d+)

exports.destroy = function (req, res) {
	req.comment.publicado = false;

	req.comment.destroy().then( function() {
		res.render('/quizes/'+req.params.quizId);})
	.catch(function(error){next(error)}); 
}; 
*/

