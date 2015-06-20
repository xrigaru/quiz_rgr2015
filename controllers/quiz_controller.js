var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
	function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
};


// GET /quizes
/*exports.index = function(req, res){
	models.Quiz.findAll().then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error) { next(error);})
};*/

exports.index = function(req, res){
    // se define un objeto vacio en caso de que el usuario no haga
    // una busqueda y se quieran mostrar todos los resultados
    var query = {};

    // si el usuario realiza una busqueda, componemos el query
    if(req.query.search) {
        var search = req.query.search;
        search = search.split(" ").join('%');
        search = '%' + search + '%';

        query = { where: ["pregunta like ?", search] };
    }

    models.Quiz.findAll(query).then(
		function(quizes){
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error){ next(error);});
};

// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};