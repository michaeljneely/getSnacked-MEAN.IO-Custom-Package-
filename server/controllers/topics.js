'use strict';
/** Server 'Topics Controller' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
	Topic = mongoose.model('Topic'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(G) {
	 return {
		 
		/*
		Functions
			- displayAll
			- getTopicById
		*/
		
		displayAll: function(req, res, next) {
			var query = Topic.find().sort({rank : 1});
			query.exec(function (err, topics){
				if (err) { return res.status(500).json({err: err.toString() }); }
				if (!topics) { return res.status(404).json({err: 'Posts Not Found' }); }
				res.json(topics);
			});
		},
		
		getTopicById: function(req, res, next) {
			var t = req.params.t_id;
			var topicQuery = Topic.find({topic_id : t});
			topicQuery.exec(function(err, topic){
				if (err) { return res.status(500).json({err: '500' }); }
				else if(topic.length == 0) { return res.status(500).json({err: '500' }); }
				else{
					var query = Post.find({topic : t}).sort({ups : -1});
					query.exec(function (err, posts){
						if (err) { return res.status(500).json({err: '500' }); }
						else if (posts.length == 0) { return res.status(404).json({err: '404' }); }
						else res.json(posts);
					});
				}
			});
		},
	 };
}