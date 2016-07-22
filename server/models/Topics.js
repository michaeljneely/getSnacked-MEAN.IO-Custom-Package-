'use strict';

/** Server 'Topic Schema' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var topicSchema = new Schema(
	{
		topic_id: {type: String },
		rank : {type: Number, min: 0, default: 0},
		description: {type: String},
	}
);

var Topic = mongoose.model('Topic', topicSchema);