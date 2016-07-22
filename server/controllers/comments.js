'use strict';
/** Server 'Comments Controller' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
	Topic = mongoose.model('Topic'),
	Comment = mongoose.model('Comment'),
	User = mongoose.model('User'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(G) {
	
	return {
		
		/*
		Functions
			- getCommentById
			- getCommentsByPost
			- newComment
			- editComment
			- deleteComment
			- Vote
		*/
		
		//Get a Comment By its Unique Id
		getCommentById: function(req,res,next) {
			var c_id = req.params.c_id;
			var query = Comment.findOne({comment_id : c_id})
			query.exec(function (err, comment){
				if (err) { return res.status(500).json({err: err.toString() }); }
				if (!comment) { return res.status(404).json({err: 'Not Found' }); }
				res.json(comment);
			});
		},
		
		//Vote on a Comment
		Vote : function(req,res) {
			try{
				var u_id = req.user._id;
				var t_id = req.params.t_id;
				var p_id = req.params.p_id;
				var c_id = req.params.c_id;
				var vote_type = req.params.vote_type;
				if(vote_type == "up") vote_type = 1;
				if(vote_type == "down") vote_type = -1;
				if (vote_type == "query") vote_type = 0;
				var query = Comment.findOne({comment_id : c_id});
				query.exec(function (err, response){
					if (err) { return res.status(500).json({err: err.toString() }); }
					if (!response) { return res.status(404).json({err: 'Not Found' }); }
					var a = false;
					var b = 0;
					for (var i = 0 ; i < response.voters.length; i++){
						if(response.voters[i].voter == u_id){
							a = true;
							b = response.voters[i].value;
							break;
						}
					}
					if (vote_type == 0) res.json(b);
					else if(a == true && b == 1 && vote_type == b) res.json('already upvoted');
					else if (a == true && b == -1 && vote_type == b) res.json('already downvoted');
					else if (a == true && b == 1 && vote_type != b && vote_type == -1 ){
						var changeToDownVote = Comment.update({comment_id: c_id, "voters.voter": u_id}, {$set: {"voters.$.value" : -1}})
						changeToDownVote.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementDownsDecrementUps = Comment.update({comment_id: c_id}, {$inc: {downs: 1, ups : -1}});
						incrementDownsDecrementUps.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var decrementKarma = User.update({_id : response.author_id}, {$inc: {karma: -1}});
						decrementKarma.exec(function(err){
							if(err) { return res.status(500).json({err: err.toString() }); }
						});
						res.json('changed to downvote');
					}
					else if (a == true && b == -1 && vote_type != b && vote_type == 1){
						var changeToUpVote = Comment.update({comment_id: c_id, "voters.voter": u_id}, {$set: {"voters.$.value" : 1}})
						changeToUpVote.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementUpsDecrementDowns = Comment.update({comment_id: c_id}, {$inc: {downs: -1, ups : 1}});
						incrementUpsDecrementDowns.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementKarma = User.update({_id : response.author_id}, {$inc: {karma: 1}});
						incrementKarma.exec(function(err){
							if(err) { return res.status(500).json({err: err.toString() }); }
						});
						res.json('changed to upvote');
					}
					else if (a == false && vote_type == 1){
						var addUpVoter = Comment.update({comment_id: c_id}, {$push : {voters : {voter: u_id, value: vote_type}}});
						addUpVoter.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementUps = Comment.update({comment_id: c_id}, {$inc: {ups: 1}});
						incrementUps.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementKarma = User.update({_id : response.author_id}, {$inc: {karma: 1}});
						incrementKarma.exec(function(err){
							if(err) { return res.status(500).json({err: err.toString() }); }
						});
						res.json('successfuly upvoted');
					}
					else if (a == false && vote_type == -1){
						var addDownVoter = Comment.update({comment_id: c_id}, {$push : {voters : {voter: u_id, value: vote_type}}});
						addDownVoter.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementDowns = Comment.update({comment_id: c_id}, {$inc: {downs: 1}});
						incrementDowns.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var decrementKarma = User.update({_id : response.author_id}, {$inc: {karma: -1}});
						decrementKarma.exec(function(err){
							if(err) { return res.status(500).json({err: err.toString() }); }
						});
						res.json('successfuly downvoted');
					}
					else res.json('error');;
				});
			}
			catch (err){
				return res.status(401).json({
					error: 'Could not Vote'
				});
			}
		},
		
		//Get all Comments for a Post
		getCommentsByPost : function(req,res,next) {
			var p_id = req.params.p_id;
			var query = Comment.find({post : p_id}).sort({ups : -1})
			query.exec(function (err, comments){
				if (err) { return res.status(500).json({err: err.toString() }); }
				if (!comments) { return res.status(404).json({err: 'Not Found' }); }
				res.json(comments);
			});
		},
		
		//Create a New Comment
		newComment : function(req, res) {
			var comment = new Comment(req.body);
			try{
				comment.author_id = req.user._id;
				comment.author_name = req.user.name;
				comment.comment_id = mongoose.Types.ObjectId();
				comment.save(function(err) {
					if (err) {
						return res.status(500).json({
							error: 'Cannot save the comment'
						});
					}
					res.json(comment.comment_id);
				});
			}
			catch (err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		},
		
		//Edit a Comment
		editComment : function(req, res) {
			var comment = new Comment(req.body);
			try{
				var newContent = comment.content;
				var author = comment.author_id;
				var u_id = req.user._id;
				if(u_id == author){
					var update = Comment.update({comment_id: comment.comment_id}, {$set: {"content" : newContent, "edited": 1}});
					update.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot update the comment'
								});
							}
							else res.json('Successfuly Updated');
						});
				}
				else res.json('Not owner!');
			}
			catch (err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		}, 
		
		//Delete a Comment
		deleteComment : function(req, res) {
			var comment = new Comment(req.body);
			try{
				var author = comment.author_id;
				var u_id = req.user._id;
				if(u_id == author){
					var del = Comment.remove({comment_id: comment.comment_id});
					del.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot delete the comment'
								});
							}
							else res.json('Successfuly Deleted');
						});
				}
				else res.json('Not owner!');
			}
			catch (err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		}

	};
}