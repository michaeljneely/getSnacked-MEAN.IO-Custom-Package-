'use strict';
/** Server 'User' Controller for getSnacked package 'G'
Author: Michael Neely 13100590 
**/


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	Feed = mongoose.model('Feed'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(G) {
	
	return {
		
		/*
		Functions
			- getCurrentUser
			- getUserById
			- getMessagesForCurrentUser
		*/
		
		//Get all Users
		getAllUsers : function(req,res,next){
			var query = User.find();
			query.exec(function (err, users){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!users) { return res.status(404).json({err: 'Users Not Found' }); }
					res.json(users);
				});
		},
		
		//Get Current Passport User Id
		getCurrentUser : function(req, res, next){
			try {
				var u_id = req.user._id;
				var query = User.findOne({_id : u_id});
				query.exec(function (err, user){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!user) { return res.status(404).json({err: 'User Not Found' }); }
					res.json(user);
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},
		
		//Get a User By Their Id
		getUserById: function(req, res, next) {
			var u = req.params.u_id;
			var query = User.findOne({_id : u});
			query.exec(function (err, user){
				if (err) { return res.status(500).json({err: err.toString() }); }
				if (!user) { return res.status(404).json({err: 'User Not Found' }); }
				res.json(user);
			});
		},
				
		//Get All Posts for Current User
		loadCurrentUsersPosts : function(req,res, next) {
			try {
				var u_id = req.user._id;
				var query = Post.find({author_id : u_id}).sort({date : -1});
				query.exec(function (err,posts){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!posts) { return res.status(404).json({err: 'Posts Not Found' }); }
					res.json(posts);
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},
		
		//Get All Messages for Current User
		getMessagesForCurrentUser : function(req, res, next) {
			try {
				var u_id = req.user._id;
				var query = Message.find({recipient_id : u_id});
				query.exec(function (err, messages){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!messages) { return res.status(404).json({err: 'Messages Not Found' }); }
					if (messages.length == 0) { return res.status(404).json({err: 'Messages Not Found' }); }
					res.json(messages);
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},
		
		//Get All Sent Messages for Current User
		getSentMessagesForCurrentUser: function(req,res,next){
			try {
				var u_id = req.user._id;
				var query = Message.find({author_id : u_id});
				query.exec(function (err, messages){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!messages) { return res.status(404).json({err: 'Messages Not Found' }); }
					if (messages.length == 0) { return res.status(404).json({err: 'Messages Not Found' }); }
					res.json(messages);
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},
		
		//Get All Feeds For Current User
		getFeedsForCurrentUser: function(req,res,next){
			try{
				var u_id = req.user._id;
				var query = Feed.findOne({user_id : u_id});
				query.exec(function (err, feeds){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!feeds) { return res.status(404).json({err: 'Feeds Not Found' }); }
					if (feeds.length == 0) { return res.status(404).json({err: 'Feeds Not Found' }); }
					res.json(feeds);
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},
		
		//Add Feed
		addFeedForCurrentUser : function(req,res,next){
			try{
				var u_id = req.user._id;
				var name = req.body.feed_name;
				var url = req.body.feed_url;
				var check = Feed.findOne({user_id : u_id});
				check.exec(function(err,feed){
					if (err) { return res.status(500).json({err: err.toString() }); }
					//If No User In The Feed Collection - Add That User
					if(!feed){
						var feed = new Feed();
						feed.user_id = u_id;
						feed.feeds.push({"feed_name" : name, "feed_url" : url});
						feed.save(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot save the post'
								});
							}
						});
					}
					//Otherwise Check To See If the Feed Has Already Been Inserted
					else{
						var checkTwo = Feed.findOne({user_id : u_id, 'feeds.feed_name' : name});
						checkTwo.exec(function(err,result){
							if (err) { return res.status(500).json({err: err.toString() }); }
							//Feed Needs to Be Inserted
							if (!result){
								var update = Feed.update({user_id : u_id}, {$push: {feeds: {feed_name : name, feed_url : url}}});
									update.exec(function(err, result){
										if (err) {
											return res.status(500).json({
												error: 'Cannot update the feed'
											});
										}
										res.json('successfuly added');
									});
							}
							else {
								res.json('You\'ve Already Added That Feed');
							}
						});
					}
				});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		},

		//Delete Feed
		deleteFeedForCurrentUser : function(req,res,next){
			try{
				var name = req.body.feed_name;
				var url = req.body.feed_url;
				var u_id = req.user._id;
					var del = Feed.update({user_id : u_id}, {$pull: {feeds: {feed_name : name, feed_url : url}}});
					del.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot delete the feed'
								});
							}
							else res.json('Successfuly Deleted');
						});
			}
			catch (err){
				return res.status(401).json({err: 'No Current User' });
			}
		}
	};
}