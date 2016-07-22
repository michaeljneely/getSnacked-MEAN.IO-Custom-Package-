'use strict';

/** Server 'Message Schema' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema(
	{
		message_id: Schema.Types.ObjectId,
		author_id: Schema.Types.ObjectId,
		author_name: {type: String},
		recipient_id: Schema.Types.ObjectId,
		recipient_name: {type: String},
		date : Schema.Types.Date,
		content : {type: String },
	}
);
var Message = mongoose.model('Message', messageSchema);
