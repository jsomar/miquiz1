var models = require('../models/models.js');

exports.index = function (req, res) {

	models.Quiz.count().then(function (preguntas) {
		
	models.Comment.count().then (function (comentarios) {

	var media_comentarios = comentarios / preguntas;

	models.Quiz.findAll({
		include:[{model: models.Comment}]
	}).then(function (quizes) {

		var pre_con_commet = 0;
		for (i in quizes){
			if (quizes[i].Comments.length) {

					pre_con_commet++;
			};
		}

		var pre_sin_commet = preguntas - pre_con_commet;

		res.render('statistics/index.ejs', { quizes: preguntas,
										comments: comentarios,
										mediacomentarios: media_comentarios,
										preConComment: pre_con_commet,
										preSinComment: pre_sin_commet,
										errors: []
									});
	})


	})
});

};



/*
1 +var models = require('../models/models.js');  
 2 +  
 3 + 
 4 +    El número de preguntas  
 5 +    El número de comentarios totales  
 6 +    El número medio de comentarios por pregunta  
 7 +    El número de preguntas sin comentarios  
 8 +    El número de preguntas con comentarios  
 9 +  
 10 + 
 11 +exports.show = function(req,res){  
 12 +  models.Quiz.count().then(function (_quizes){  
 13 +  
 14 +  models.Comment.count().then(function (_comments){  
 15 +  
 16 +  var _midComments= _comments / _quizes;  
 17 +  
 18 +  models.Quiz.findAll({  
 19 +    include:[{model: models.Comment}]  
 20 +    }).then(function (quizes){  
 21 +  
 22 +        var _quesWithCom = 0;  
 23 +        for (i in quizes){  
 24 +        if (quizes[i].Comments.length)  
 25 +        _quesWithCom++;  
 26 +    }  
 27 +  
 28 +    var _quesWithoutCom = _quizes - _quesWithCom;  
 29 +  
 30 +    res.render('estadisticas/index', {quizes: _quizes,  
 31 +                                      comments: _comments,  
 32 +                                      midComments: _midComments,  
 33 +                                      quesWithCom: _quesWithCom,  
 34 +                                      quesWithoutCom: _quesWithoutCom,  
 35 +                                      errors: []  
 36 +    });  
 37 +  
 38 +  })  
 39 +  
 40 +  })  
 41 +});  
 42 +};

	models.Quiz.findAll().then(function (preguntas){  
   
 	  	models.Comment.findAll().then(function (comentarios){  
 	  	  
 		    res.render('db/index', {quizes: preguntas,  
 		                      comments: comentarios,  
 		                      errors: []  
 		    });  
 		});  
 	});  
 }; 
exports.index = function (req, res) {
	res.render('quizes/holamundo.ejs', {errors: []});
};


*/

