'use strict';
/** Server 'Messages Controller' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Message = mongoose.model('Message'),
	User = mongoose.model('User'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(G) {
	/*
	Functions
		- getMessageById
		- newMessage
		- deleteMessage
	*/
	return {
		
		//Get a Message by its Unique Id
		getMessageById : function(req, res, next) {
			var m_id = req.params.m_id;
			var query = Message.find({_id : m_id});
			query.exec(function (err, message){
				res.json(message);
			});
		},
		
		//Create a New Message
		newMessage : function(req, res) {
			var message = new Message(req.body);
				message.author_id = req.user._id;
				message.author_name = req.user.name;
				var a = JSON.stringify(message.recipient_id);
				var b = JSON.stringify(message.author_id);
				if(a == b){
					return res.status(500).json({
							error: 'You cannot send a message to yourself'
					});
				}
				var getName = User.findOne({_id: message.recipient_id});
				getName.exec(function(err, u) {
					if (err) {
						return res.status(500).json({
							error: 'Cannot delete the message'
						});
					}						
					message.recipient_name = u.name;
					message.message_id = mongoose.Types.ObjectId();
					message.save(function(err) {
						if (err) {
							return res.status(500).json({
								error: 'Cannot save the message'
							});
						}
						res.json('success');
					});
				});
				
		},
		
		//Delete a Message
		deleteMessage : function(req, res) {
			var message = new Message(req.body);
			try{
				var u_id = req.user._id;
				var recip = message.recipient_id;
				if(u_id == recip){
					var del = Message.remove({message_id: message.message_id});
					del.exec(function(err) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot delete the message'
								});
							}
							else res.json('Successfuly Deleted');
						});
				}
				else{
					return res.status(500).json({
									error: 'Not the Recipient!'
					});
				}
			}
			catch (err) {
				return res.status(401).json({
					error: 'No Current User'
				});
			}
		}
	};
}


