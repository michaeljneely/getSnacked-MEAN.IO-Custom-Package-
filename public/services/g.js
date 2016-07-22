'use strict';

/** Public Services for getSnacked Package 'G'
Author: Michael Neely 13100590 **/

angular.module('mean.g').factory('G', [ '$http', '$q', 'uiGmapGoogleMapApi',
	function($http, $q, uiGmapGoogleMapApi) {
		return {
			name: 'g',
			
			//Parse data at a URL
			parseData : function(url){
				var data = $http.get(url);          
				return data;
			},
			
			//Get The Current User
			getUser : function(){
				var user = $http.get('/api/g/users/getCurrentUser');
				return user;
			},
			
			//Create a Post
			createPost : function(post){
				var data = $http.post('/api/g/newPost',post);
				return data;
			},
			
			//Create a Comment
			createComment: function(comment){
				var data = $http.post('/api/g/newComment', comment);
				return data;
			},
			
			//Edit a Post
			editPost : function(post){
				var data = $http.post('/api/g/editPost', post);
				return data;
			},
			
			//Delete a Post
			deletePost: function(post_id){
				$http.post('/api/g/deletePost', post_id);
			},
			
			//Delete a Comment
			deleteComment: function(comment){
				var data = $http.post('/api/g/deleteComment', comment);
				return data;
			},
			
			//Edit a Comment
			editComment: function(comment){
				var data = $http.post('/api/g/editComment', comment);
				return data;
			},
			
			//Send a Message
			sendMessage : function(message){
				var data = $http.post('/api/g/messages/newMessage', message);
				return data;
			},
			
			//Delete a Message
			deleteMessage : function(message){
				var data = $http.post('/api/g/messages/deleteMessage', message);
				return data;
			},
			
			//Set Map Options
			getMapOptions : function(){
				return{
					mapOptions : {
						minZoom : 3,
						zoomControl : false,
						draggable : true,
						navigationControl : false,
						mapTypeControl : false,
						scaleControl : true,
						streetViewControl : false,
						mapTypeId : google.maps.MapTypeId.ROADMAP,
						disableDoubleClickZoom : false,
						keyboardShortcuts : true,
						styles : [{
							featureType : "poi",
							elementType : "labels",
							stylers : [{
								visibility : "off"
							}]
						}, {
							featureType : "transit",
							elementType : "all",
							stylers : [{
								visibility : "off"
							}]
						}],
					}
				};
			},
			
			//Get Users Location
			getCurrentLocation : function(){
				var deferred = $q.defer();
				navigator.geolocation.getCurrentPosition(function(position) {
					var myCurrentLocation = {
						latitude : position.coords.latitude, 
						longitude : position.coords.longitude
					};
					deferred.resolve(myCurrentLocation);
				});
				return deferred.promise;
			},
			
			//Get Feeds
			getFeeds : function(){
				var data = $http.get('/api/g/users/getCurrentUser/feeds');
				return data;
			},
			
			//Parse Feeds
			parseFeed : function(url){
				return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=5&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
			},
			
			//Add Feed
			addFeed : function(feed){
				var data = $http.post('/api/g/users/getCurrentUser/feeds/add', feed);
				return data;
			},
			
			//Delete Feed
			deleteFeed : function(feed){
				var data = $http.post('/api/g/users/getCurrentUser/feeds/delete', feed);
				return data;
			},
			
			//Display Yelp Restaurants
			displayRestaurants : function(loc){
				var data = $http.post('api/g/yelp/search', loc);
				return data;
			}
		};
	}
]);