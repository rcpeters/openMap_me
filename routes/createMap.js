
/*
 * GET home page.
 */
var mapProvider = require('../project_modules/data_providers/mapProvider').MapProvider;
var cookieId = 'oMapV3';
 
exports.index = function(req, res){
	mapProvider.createMap(function (error, map) {
		res.redirect('/map_' + map.id);
	});
};