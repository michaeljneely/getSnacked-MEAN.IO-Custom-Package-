'use strict';
/** Server 'Yelp Controller' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/
//Uses https://github.com/olalonde/node-yelp
var Yelp = require('yelp');

module.exports = function(G) {
	
	return {
		Search : function(req,res,next){
			

			var yelp = new Yelp({
			  consumer_key: 'Fx5ZnEPYPLI5QM2zeGUv7g',
			  consumer_secret: 'WnW2xx8pzMvm8EHJQ1FqMXqALw4',
			  token: 'JCacIdVyOWDR8JQaacw6ZeFgCPM1O2Xw',
			  token_secret: 'zyJ_5NS5BYD6w0FzWIFuZXlIg_w',
			});

			//Get All Restaurants in a 1000 Metre radius of Location
			yelp.search({ term: 'restaurants', ll:''+req.body.latitude+','+req.body.longitude+'', radius_filter: '1000'})
				.then(function (data) {
				  res.json(data);
				})
				.catch(function (err) {
					res.json(err);
				});
		}
	};
}