'use strict';

/** Server 'Post Schema' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema(
	{
		post_id: Schema.Types.ObjectId,
		topic: {type: String},
		date : Schema.Types.Date,
		author_id: Schema.Types.ObjectId,
		author_name: {type: String},
		title : {type: String },
		content : {type: String },
		edited: {type: Number, default: 0},
		ups : {type: Number, min: 0, default: 0},
		downs : {type: Number, min: 0, default: 0 },
		voters : [{voter: Schema.Types.ObjectId, value: Schema.Types.Number}]
	}
);
var Post = mongoose.model('Post', postSchema);
