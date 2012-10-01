
/*
 * GET home page.
 */
var mapProvider = require('../project_modules/data_providers/mapProvider').MapProvider;
var cookieId = 'oMapV3';
 
exports.index = function(req, res){
	res.render('index', {});
		//res.render('index', { title: 'Open Map Me', 'map': map, 'users': users, 'cookieId': cookieId});
};