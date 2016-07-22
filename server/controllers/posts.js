'use strict';
/** Server 'Post Controller' for getSnacked package 'G'
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
			- getPostById
			- newPost
			- editPost
			- deletePost
			- Vote
			
		*/
		
		//Get a Post by its Id
		getPostById: function(req, res) {
			var t_id = req.params.t_id;
			var p_id = req.params.p_id;
			var query = Post.findOne({$and: [{topic: t_id}, {post_id: p_id }]})
			query.exec(function (err, post){
				if (err) { return res.status(500).json({err: err.toString() }); }
				if (!post) { return res.status(404).json({err: 'Not Found' }); }
				res.json(post);
			});
		},
		
		//Vote On a Post 
		Vote : function(req,res) {
			try{
				var u_id = req.user._id;
				var t_id = req.params.t_id;
				var p_id = req.params.p_id;
				var vote_type = req.params.vote_type;
				if(vote_type == "up") vote_type = 1;
				if(vote_type == "down") vote_type = -1;
				if (vote_type == "query") vote_type = 0;
				var query = Post.findOne({post_id : p_id});
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
						var changeToDownVote = Post.update({post_id: p_id, "voters.voter": u_id}, {$set: {"voters.$.value" : -1}})
						changeToDownVote.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementDownsDecrementUps = Post.update({post_id: p_id}, {$inc: {downs: 1, ups : -1}});
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
						var changeToUpVote = Post.update({post_id: p_id, "voters.voter": u_id}, {$set: {"voters.$.value" : 1}})
						changeToUpVote.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementUpsDecrementDowns = Post.update({post_id: p_id}, {$inc: {downs: -1, ups : 1}});
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
						var addUpVoter = Post.update({post_id: p_id}, {$push : {voters : {voter: u_id, value: vote_type}}});
						addUpVoter.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementUps = Post.update({post_id: p_id}, {$inc: {ups: 1}});
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
						var addDownVoter = Post.update({post_id: p_id}, {$push : {voters : {voter: u_id, value: vote_type}}});
						addDownVoter.exec(function(err){
							if (err) { return res.status(500).json({err: err.toString() }); }
						});
						var incrementDowns = Post.update({post_id: p_id}, {$inc: {downs: 1}});
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
		
		//Create New Post
		newPost: function(req, res) {
            var post = new Post(req.body);
			try {
				var u = req.user._id;
				var n = req.user.name;
				post.author_id = u;
				post.author_name = n;
				post.post_id = mongoose.Types.ObjectId();
				post.save(function(err) {
					if (err) {
						return res.status(500).json({
							error: 'Cannot save the post'
						});
					}
					res.json(post.post_id);
				});
			}
			catch(err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
        },
		
		//Edit Post
		editPost: function(req, res){
			try {
				var u = req.user._id;
				var p = req.body;
				var newContent = p.content;
				var newTitle = p.title;
				var p_id = p.post_id;
				var check = Post.findOne({post_id : p_id});
				check.exec(function(err,post) {
					if (post.author_id == u){
						var edit = Post.update({post_id : p_id}, {$set: {"content" : newContent, "title": newTitle, "edited": 1}});
						edit.exec(function(err,post) {
							if (err) return res.status(500).json({ error: 'Cannot edit the post' });
							else res.json(post.post_id);
						});
					}
					else{
						return res.status(401).json({ error: 'Not the Owner'});
					}
				});
			}
			catch(err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		},
		
		//Delete a Post
		deletePost: function(req, res) {
			try {
				var u = req.user._id;
				var p_id = req.body.post_id;
				var check = Post.findOne({post_id : p_id});
				check.exec(function(err,post) {
					if (post.author_id == u){
						var del = Post.remove({post_id : p_id});
						del.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot delete the post'
								});
							}
						});
						var delComments = Comment.remove({post: p_id});
						delComments.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot delete the comments'
								});
							}
							res.json('deleted');
						});
					}
					else{
						return res.status(401).json({ error: 'Not the Owner'});
					}
				});
			}
			catch(err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		}
	 };
}