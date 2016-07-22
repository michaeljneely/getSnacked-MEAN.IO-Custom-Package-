'use strict';
/** Public Routes for getSnacked Package 'G'
Author: Michael Neely 13100590 **/

angular.module('mean.g').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider

.state('fb', {
	url: '/g/facebook',
	templateUrl: 'g/views/fb.html'
})
.state('map', {
	url: '/g/map',
	templateUrl: 'g/views/map.html'
})

.state('yelp', {
	url: '/g/restaurants',
	templateUrl: 'g/views/yelp.html'
})

.state('topics', {
	url: '/g/topics',
	templateUrl: 'g/views/topics.html'
  })
  
 .state('topics redirect', {
	url: '/g/topics/',
	templateUrl: 'g/views/topics.html'
  })
  
 .state('topic', {
	url: '/g/topics/:t_id',
	templateUrl: 'g/views/topic.html'
 })
 
 .state('edit post', {
	url: '/g/topics/:t_id/:p_id/edit',
	templateUrl: 'g/views/editPost.html'
 })
 
 .state('create post', {
	  url: '/g/topics/:t_id/create',
	  templateUrl: 'g/views/createPost.html'
  })
  
 .state('post', {
	url: '/g/topics/:t_id/:p_id',
	templateUrl: 'g/views/post.html'
  })
  
  .state('me', {
	url: '/g/me',
	templateUrl: 'g/views/me.html'
  })
  
  .state('add feed', {
	url: '/g/me/addFeed',
	templateUrl: 'g/views/addFeed.html'
  })
  
  .state('user', {
	url: '/g/users/:u_id',
	templateUrl: 'g/views/user.html'
  })
  
  .state('members', {
	url: '/g/members',
	templateUrl: 'g/views/members.html'
  })
}

]);
