'use strict';

/** Server 'Comment Schema' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema(
	{
		comment_id: Schema.Types.ObjectId,
		post: Schema.Types.ObjectId,
		date : Schema.Types.Date,
		author_id: Schema.Types.ObjectId,
		author_name: {type: String},
		content : {type: String },
		edited : {type: Number, default: 0},
		ups : {type: Number, min: 0, default: 0},
		downs : {type: Number, min: 0, default: 0 },
		voters : [{voter: Schema.Types.ObjectId, value: Schema.Types.Number}]
	}
);
var Comment = mongoose.model('Comment', commentSchema);
