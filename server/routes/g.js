'use strict';
/** Server Routes for getSnacked package 'G'
Author: Michael Neely 13100590 
**/


//Routes
module.exports = function(G, app, auth) {
	
	var topics = require('../controllers/topics')(G);
	var posts = require('../controllers/posts')(G);
	var comments = require('../controllers/comments')(G);
	var users = require('../controllers/users')(G);
	var messages = require('../controllers/messages')(G);
	var yelp = require('../controllers/yelp')(G);
	
	/** Topic Routes **/ 
	
	//Display All Topics
	app.route('/api/g/topics')
		.get(topics.displayAll);
		
	//Get a Topic By Id
	app.route('/api/g/topics/:t_id')
		.get(topics.getTopicById)
		
	/** Post Routes **/
	
	//Get a Post by Id
	app.route('/api/g/topics/:t_id/:p_id')
		.get(posts.getPostById)
		
	//New Post
	app.route('/api/g/newPost')
		.post(posts.newPost);
		
	//Edit Post
	app.route('/api/g/editPost')
		.post(posts.editPost);
		
	//Delete Post
	app.route('/api/g/deletePost')
		.post(posts.deletePost);
		
	//Vote for a Post
	app.route('/api/g/topics/:t_id/:p_id/vote/:vote_type')
		.get(posts.Vote);
		
	/** Comment Routes **/
	
	//Get Comments for a Post	
	app.route('/api/g/topics/:t_id/:p_id/comments')
		.get(comments.getCommentsByPost);
		
	//Get Comment by Id
	app.route('/api/g/topics/:t_id/:p_id/:c_id')
		.get(comments.getCommentById)
	
	//New Comment
	app.route('/api/g/newComment')
		.post(comments.newComment);
		
	//Edit Comment
	app.route('/api/g/editComment')
		.post(comments.editComment);
		
	//Delete Comment
	app.route('/api/g/deleteComment')
		.post(comments.deleteComment);
		
	//Vote for a Comment
	app.route('/api/g/topics/:t_id/:p_id/:c_id/vote/:vote_type')
		.get(comments.Vote);
		
		
	/** User Routes **/
	
	//Get All Users
	app.route('/api/g/members/all')
		.get(users.getAllUsers);
	//Get Current User
	app.route('/api/g/users/getCurrentUser')
		.get(users.getCurrentUser);
	
	//Get User by Id
	app.route('/api/g/users/id/:u_id')
		.get(users.getUserById);
		
	//Get Current Users Posts
	app.route('/api/g/users/getCurrentUsersPosts')
		.get(users.loadCurrentUsersPosts);
		
	//Get Current User's Messages
	app.route('/api/g/users/getCurrentUser/inbox')
		.get(users.getMessagesForCurrentUser);
		
	//Get Current User's Sent Messages
	app.route('/api/g/users/getCurrentUser/inbox/sent')
		.get(users.getSentMessagesForCurrentUser);
	
	//Get Current User's Feeds
	app.route('/api/g/users/getCurrentUser/feeds')
		.get(users.getFeedsForCurrentUser);
		
	//Add Feed 
	app.route('/api/g/users/getCurrentUser/feeds/add')
		.post(users.addFeedForCurrentUser);
		
	//Delete Feed
	app.route('/api/g/users/getCurrentUser/feeds/delete')
		.post(users.deleteFeedForCurrentUser);
	
	/** Messages Routes **/
	//Get Message by Id
	app.route('/api/g/messages/:m_id')
		.get(messages.getMessageById);
		
	//New Message
	app.route('/api/g/messages/newMessage')
		.post(messages.newMessage);
	
	//Delete Message
	app.route('/api/g/messages/deleteMessage')
		.post(messages.deleteMessage);

	/** Yelp Routes **/
	app.route('/api/g/yelp/search')
		.post(yelp.Search);
};