'use strict';

/** Server 'Feed Schema' for getSnacked package 'G'
Author: Michael Neely 13100590 
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedsSchema = new Schema(
	{
		user_id: Schema.Types.ObjectId,
		feeds : [{feed_name: String, feed_url: String}]
	}
);
var Feed = mongoose.model('Feed', feedsSchema);