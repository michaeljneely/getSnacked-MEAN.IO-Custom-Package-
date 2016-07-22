/** Public Controllers for getSnacked Package 'G'
Author: Michael Neely 13100590 **/

//Module
var myApp = angular.module('mean.g', ['uiGmapgoogle-maps']);

//Topic Controller -- Done
myApp.controller('TopicsController', ['$scope', 'Global', 'G',
	function($scope, Global, G) {
		$scope.global = Global;
		$scope.package = {
			name: 'g'
		};
		//Load All Topics
		$scope.load = function(){      
			G.parseData('/api/g/topics').then(function(res){        
				$scope.topics = res.data;
			});
		};
	}
]);

//Yelp Controller
myApp.controller('YelpController', ['$scope', 'Global', 'G',
	function($scope, Global, G) {
		$scope.global = Global;
		$scope.package = {
			name: 'g'
		};
		//Load Restaurants
		$scope.loadRestaurants = function(){
			G.getCurrentLocation()
			.then(function(myCurrentLocation){
				G.displayRestaurants(myCurrentLocation).then(function(res){
					$scope.results = res.data.total;
					$scope.restaurants = res.data.businesses;
				});
			});
		};
		
		//Display Categories Correctly
		$scope.displayCategories = function(restaurant){
			var num = restaurant.categories.length;
			var res = "";
			for (var i = 0; i < num; i++){
				res = res + String(restaurant.categories[i][0]) + ", ";
			}
			res = res.substring(0, res.length - 2);
			return res;
		};
	}
]);

//Google Map Api Provider
myApp.config(function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		//My Key
		key: 'AIzaSyCWW_uM-18GJFf-yI3E6k8qztt7uK8pvxg',
		v: '3',
		libraries: 'places,weather,geometry,visualization'
	});
});

//Map Controller
myApp.controller('MapController', 
	function($scope, uiGmapGoogleMapApi, G, uiGmapIsReady) {
		$scope.myCurrentLocation = {};
		var initialMapLoad = 0;
		G.getCurrentLocation()
		.then(function(myCurrentLocation){
			$scope.myCurrentLocation = myCurrentLocation;
		})
		.then(function(){return uiGmapGoogleMapApi;})
		.then(function(maps){
			$scope.googlemap = {};
			$scope.map = {
				center: {        // set Seattle as default :)
					latitude: 47.6205, 
					longitude: 122.3493
				},
				zoom: 13,
				pan: 1,
				options: G.getMapOptions().mapOptions,
				control: {},
				events: {
					//Fires on Move/Zoom
					tilesloaded: function (maps, eventName, args) {},
					//Fires on Drag
					dragend: function (maps, eventName, args) {},
					//Fires on Zoom Change
					zoom_changed: function (maps, eventName, args) {}
				}
			};
			$scope.map.center = $scope.myCurrentLocation;
		});
    
		uiGmapIsReady.promise()
			.then(function(instances) {	
				var maps = instances[0].map;
				$scope.initMap(maps); 
			});
    
		$scope.initMap = function(maps){
			var center = maps.getCenter();
			var lat = center.lat();
			var lng = center.lng();
			var pos = {
				lat: lat,
				lng: lng
			};
			var infowindow = new google.maps.InfoWindow();
			var  createMarker = function(place) {
				var placeLoc = place.geometry.location;
				var marker = new google.maps.Marker({
					map: maps,
					position: place.geometry.location,
					place: {
						placeId: place.place_id,
						location: place.geometry.location
					}
				});
				google.maps.event.addListener(marker, 'click', function() {
					var info = place.name;
					infowindow.setContent(info);
					infowindow.open(maps, this);
				});
			};
			var callback = function(results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					for (var i = 0; i < results.length; i++) {
						createMarker(results[i]);
					}
				}
			};
			var request = {
				location: pos,
				radius: '1000',
				types: ['restaurant']
			};
			var service = new google.maps.places.PlacesService(maps);
			service.nearbySearch(request, callback);
			var man = 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png';
			var centerMarker = new google.maps.Marker({
				map: maps,
				position: pos,
				icon: man
			});
			google.maps.event.addListener(centerMarker, 'click', function() {
				infowindow.setContent('Me!');
				infowindow.open(maps, this);
			});
		};
	});

//Topic Controller
myApp.controller('TopicController', ['$scope', 'Global', 'G', '$stateParams',
  function($scope, Global, G, $stateParams ) {
    $scope.global = Global;
    $scope.package = {
		name: 'g'
    };
	
	//Load a Topic's Posts
	$scope.load = function(){
		var t = $stateParams.t_id;
		$scope.topic = t;
		G.parseData('/api/g/topics/' + t)
		.error(function(res){
			if(res.err == "404"){
				$scope.is404 = true;
			}
			else if (res.err == "500"){
				$scope.is500 = true;
			}
		})
		.then(function(res){  
			$scope.is404 = false;
			$scope.is500 = false;
			$scope.posts = res.data;	
		});
	};
	
	//Redirect to Post Creation Page
	$scope.createPostRedirect = function(){
		var t = $stateParams.t_id;
		var dest = '/g/topics/'+t+'/create';
		window.location = dest;
	};
	
	//Redirect to Topics List
	$scope.topicsRedirect = function(){
		window.location='/g/topics/';
	};
	
	//Get Date out of ISO Date String
	$scope.parseDate = function(date){
		date = new Date(date);
		return date.toString();
	};
  }
]);

//Post Controller
myApp.controller('PostController', ['$scope', 'Global', 'G', '$stateParams',
  function($scope, Global, G, $stateParams) {
    $scope.global = Global;
    $scope.package = {
		name: 'g'
    };
	
	//Get Date out of ISO Date String
	$scope.parseDate = function(date){
		date = new Date(date);
		return date.toString();
	};
	
	//Load Posts for Current User
	$scope.loadCurrentUsersPosts = function(){
		G.parseData('/api/g/users/getCurrentUsersPosts')
			.then(function(res){
				$scope.myPosts = res.data;
		});
	};
	
	//Check if the Current User Owns the Post at the Specified Path
	$scope.ownsPost = function(){
		G.parseData('/api/g/users/getCurrentUser')
		.then(function(res){
			var u = res.data._id;
			var t = $stateParams.t_id;
			var p = $stateParams.p_id;
			G.parseData('/api/g/topics/' + t + '/' + p)
				.then(function(res){   
				var a = res.data.author_id;
				if(a == u){
					$scope.isOwner = true;
				}
			});
		});
		$scope.isOwner = false;
	};
	
	//Delete the Post 
	$scope.deletePost = function(p){
		$scope.postToDelete = new Object();
		$scope.postToDelete.post_id = p.post_id;
		G.deletePost($scope.postToDelete)
		location.reload();
	};
	
	//Page Redirect for Editing
	$scope.redirect = function(p, t){
		var dest = '/g/topics/'+t+'/'+p+'/edit';
		window.location = dest;
	};
	
	//Edit a Post
	$scope.edit = function(){
		var post = $scope.post;
		G.editPost(post)
		.error(function(res){
			window.alert('Could not edit Post!');
		})
		.then(function(res){
			var newLoc = 'g/topics/'+$scope.getTopic()+'/'+$scope.post.post_id;
			window.location = newLoc;
		});
	};
	
	//Load a Post
	$scope.loadPost = function(){
		var t = $stateParams.t_id;
		var p = $stateParams.p_id;
		G.parseData('/api/g/topics/' + t + '/' + p)
		.error(function(err){ console.log('error!');})
		.then(function(res){   
			$scope.post = res.data;
		});
	};
	
	//Create a Post
	$scope.create = function() {
		$scope.post.date = $scope.getDate();
		$scope.post.topic = $scope.getTopic();
		G.createPost($scope.post).then(function(res){
			var p = res.data;
			var newLoc = '/g/topics/'+$scope.post.topic+'/'+p;
			window.location = newLoc;
		});
    };
	
	//Get the Current Topic
	$scope.getTopic = function(){
		var t = $stateParams.t_id;
		return t;
	};
	
	//Get the Current Data as an ISO String
	$scope.getDate = function(){
		var d = new Date();
		var n = d.toISOString();
		return n;
	};

	//Check the Votes for a Post 
	$scope.checkVote = function(){
		G.parseData('/api/g/users/getCurrentUser')
		.then(function(res){
			var u = res.data._id;
			var t = $stateParams.t_id;
			var p = $stateParams.p_id;
			G.parseData('/api/g/topics/'+t+'/'+p+'/vote/query')
			.then(function(res){
				$scope.voteOptions = [-1, -1];
				if(res.data == 0){
					//Display Both Normal
					$scope.voteOptions = [1, 1];
					$scope.msg = "Both Buttons";
				}
				else if(res.data == 1){
					//Display normal down altered up
					$scope.voteOptions = [0, 1];
				}
				else if (res.data == -1){
					//Display normal up altered down
					$scope.voteOptions = [1, 0];
				}
			});
		});
	};
	
	//Up Vote a Post
	$scope.upVote = function(){
		G.parseData('/api/g/users/getCurrentUser')
		.then(function(res){
			var u = res.data._id;
			var t = $stateParams.t_id;
			var p = $stateParams.p_id;
			G.parseData('/api/g/topics/'+t+'/'+p+'/vote/up');
			location.reload();
		});
	};
	
	//Down Vote a Post
	$scope.downVote = function(){
		G.parseData('/api/g/users/getCurrentUser')
		.then(function(res){
			var u = res.data._id;
			var t = $stateParams.t_id;
			var p = $stateParams.p_id;
			G.parseData('/api/g/topics/'+t+'/'+p+'/vote/down');
			location.reload();
		});
	};
  }
]);


//Comment Controller
myApp.controller('CommentController', ['$scope', 'Global', 'G', '$stateParams',
  function($scope, Global, G, $stateParams) {
    $scope.global = Global;
    $scope.package = {
		name: 'g'
    };
	//Get Date out of ISO Date String
	$scope.parseDate = function(date){
		date = new Date(date);
		return date.toString();
	};
	
	$scope.c_ids = [];
	$scope.options = [];
	$scope.owners = [];
	
	//Load Comments
	$scope.loadComments = function(){
		var t = $stateParams.t_id;
		var p = $stateParams.p_id;
			G.parseData('/api/g/topics/'+t+'/'+p+'/comments')
			.then(function(res){
				$scope.comments = res.data;
				var numComments = Object.keys(res.data).length;
				$scope.c_ids = [];
				$scope.options = [];
				$scope.owners = [];
				$scope.loadButtons();
				//fill c_id array
				for(var i = 0; i < numComments; i++){
					var c = res.data[i]["comment_id"];
					var owner = res.data[i]["author_id"];
					//console.log(owner);
					$scope.owners.push(owner);
					$scope.c_ids.push(c);
					G.parseData('/api/g/topics/'+t+'/'+p+'/'+c+'/vote/query')
					.then(function(res){
						var vote_type = res.data;
						if (vote_type == 0){
							$scope.options.push(1);
							$scope.options.push(1);
						}
						else if (vote_type == 1){
							$scope.options.push(0);
							$scope.options.push(1);
						}
						else if (vote_type == -1){
							$scope.options.push(1);
							$scope.options.push(0);
						}
						else{
							$scope.options.push(0);
							$scope.options.push(0);
						}
					});		
				}
			});	
	};

	$scope.permissions = [];
	$scope.loadButtons = function(){
		var currentUser = null;
		G.parseData('/api/g/users/getcurrentuser')
				.then(function(res){
					currentUser = res.data._id;
					if(currentUser != null){
			for(var i = 0; i < $scope.owners.length; i++){
				if($scope.owners[i] == currentUser) $scope.permissions.push(1);
				else $scope.permissions.push(0);
			}
		}
				});
		
		
	};	

	//If the User is Commenting
	$scope.commenting = function(){
		$scope.isCommenting = true;
	}
	
	//Create a Comment
	$scope.createComment = function(data){
		if (data != null && data != "" && data.length >= 10) {
			$scope.newComment = new Object();
			$scope.newComment.content = data;
			$scope.newComment.ups = 0;
			$scope.newComment.downs = 0;
			$scope.newComment.date = $scope.getDate();
			$scope.newComment.post = $scope.getPost();
			G.createComment($scope.newComment).then(function(res){
				var c = res.data;
				$scope.isCommenting = false;
				$scope.loadComments();
			});
		}
	};
	
	//Get Current Data as an ISO String
	$scope.getDate = function(){
		var d = new Date();
		var n = d.toISOString();
		return n;
	};

	//Get the Current Post
	$scope.getPost = function() {
		var p = $stateParams.p_id;
		return p;
	};
	
	//Up Vote
	$scope.commentUpVote = function(num){
		var c = $scope.c_ids[num];
		var t = $stateParams.t_id;
		var p = $stateParams.p_id;
		G.parseData('/api/g/topics/'+t+'/'+p+'/'+c+'/vote/up');
		location.reload();
	}
	
	//Down Vote
	$scope.commentDownVote = function(num){
		var c = $scope.c_ids[num];
		var t = $stateParams.t_id;
		var p = $stateParams.p_id;
		G.parseData('/api/g/topics/'+t+'/'+p+'/'+c+'/vote/down');
		location.reload();
	};
	
	/*Check If Current User Owns This Comment
	$scope.checkIfOwner = function(comment){
		var c = comment.author_id;
		G.parseData('/api/g/users/getCurrentUser')
		.then(function(res){
			if(c == res.data._id){
				$scope.ownsC = true;
				console.log('t');
			}
		});
		$scope.ownsC = false;
		console.log('f');
	};*/
	
	//Allow Comment Editing
	$scope.editComment = function(comment){
		$scope.isEditing = true;
	};
	
	//Edit a Comment
	$scope.edit = function(comment){
		G.editComment(comment).then(function(res){
			$scope.isEditing = false;
			window.alert(res.data);
		});
	};
	
	//Delete Comment
	$scope.deleteComment = function(comment){
		G.deleteComment(comment).then(function(res){
			window.alert(res.data);
			$scope.loadComments();
		});
	};
  }
]);

//User Controller
myApp.controller('UserController', ['$scope', 'Global', 'G', '$stateParams',
  function($scope, Global, G, $stateParams) {
    $scope.global = Global;
    $scope.package = {
		name: 'g'
    };
	$scope.loadAllUsers = function(){
		G.parseData('/api/g/members/all')
			.then(function(res){
				$scope.users = res.data;
			});
	};
	//Get Current Data as an ISO String
	$scope.getDate = function(){
		var d = new Date();
		var n = d.toISOString();
		return n;
	};
	
	//Load Current User's Data
	$scope.loadMe = function(){
		G.parseData('/api/g/users/getCurrentUser')
			.then(function(res){
				$scope.user = res.data;
			});
		
	};
	
	//Load Current User's Messages
	$scope.loadMessages = function(){
		G.parseData('/api/g/users/getCurrentUser/inbox')
			.error(function(res){
				$scope.messages404 = true;
			})
			.then(function(res){
				$scope.messages404 = false;
				$scope.messages = res.data;
			});
	};
	
	//Load Current User's Sent Messages
	$scope.loadSentMessages = function(){
		G.parseData('/api/g/users/getCurrentUser/inbox/sent')
			.error(function(res){
				$scope.sentMessages404 = true;
			})
			.then(function(res){
				$scope.sentMessages404 = false;
				$scope.sentMessages = res.data;
			});
	};
	
	//Load User's Data by ID
	$scope.loadUser = function(){
		var u = $stateParams.u_id;
		G.parseData('/api/g/users/id/'+u)
		.error(function(res){
			$scope.is500 = true;
		})
		.then(function(res){
			$scope.user = res.data;
		});
	};
	
	//User is Creating a Message
	$scope.showSending = function(){
		$scope.isSending = true;
	};
	
	//Send a Message
	$scope.sendMessage = function(content){
		if(content == null || content == "") return;
		else if (content.length < 10){
			window.alert("Minimum 10 Characters");
			return;
		}
		else{
			var message = new Object();
			message.content = content;
			message.date = $scope.getDate();
			message.recipient_id = $stateParams.u_id;
			G.sendMessage(message)
				.error(function(res){
					alert(res.error);
				})
				.then(function(res){
					alert(res.data);
					$scope.isSending = false;
				});
		}
	};
	
	//User is Replying
	$scope.showReply = function(){
		$scope.isReplying = true;
	};
	
	//Reply to a Message
	$scope.reply = function(id, name, content){
		if(content == null || content == "") return;
		else if (content.length < 10){
			window.alert("Minimum 10 Characters");
			return;
		}
		else{
			var message = new Object();
			message.content = content;
			message.date = $scope.getDate();
			message.recipient_id = id;
			message.recipient_name = name;
			G.sendMessage(message)
				.error(function(res){
					alert(res.error);
				})
				.then(function(res){
					$scope.loadSentMessages();
				});
			$scope.isReplying = false;
		}
	};
	
	//Delete Message
	$scope.deleteMessage = function(message){
		G.deleteMessage(message)
			.error(function(res){
				alert(res.error);
			})
			.then(function(res){
				$scope.loadMessages();
			});
	};

	//Get Feeds
	$scope.loadUsersFeeds = function(){
		G.getFeeds().then(function(res){
				$scope.feeds = res.data.feeds;
		});
	};
	
	//Show Users Feeds
	$scope.showFeed = function(feed){
		G.parseFeed(feed.feed_url).then(function(res){
			$scope.feedTitle = feed.feed_name;
			$scope.feedItems = res.data.responseData.feed.entries;
		});
	};
	
	//Load Feed Data
	$scope.loadFeedData=function(url){
		G.parseFeed(url).then(function(res){
			$scope.feeds = res.data.responseData.feed.entries;
		});
	};

	//Minimize Feed
	$scope.minimizeFeed = function(){
		$scope.feedItems = null;
		$scope.feedTitle = null;
	};
	
	//Redirect to Add Feed Page
	$scope.redirectToAddFeed = function(){
		window.location="/g/me/addFeed";
	};
	
	//Redirect to Profile Page
	$scope.redirectToProfile = function(){
		window.location="/g/me";
	};
	
	//Add Feed
	$scope.addFeed = function(name, url){
		var feed = new Object();
		feed.feed_name = name;
		feed.feed_url = url;
		G.addFeed(feed).then(function(res){ 
			window.alert(res.data);
		});
	};
	
	//Delete Feed
	$scope.deleteFeed = function(feed){
		G.deleteFeed(feed).then(function(res) { 
			$scope.loadUsersFeeds();
		});
	};
  }
]);