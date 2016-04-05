var forum = angular.module('forum', []);

forum.controller('forumController', ['$http', '$location', '$scope', '$cookies', 'authService',
	function($http, $location, $scope, $cookies, authService) {

	$scope.authService = authService;
	$scope.forumPosts = []
	$scope.userId = $cookies.get('userID');
	$scope.postType = 'message';
	$scope.likedPosts = {};

	refreshPosts();

	function refreshPosts() {

		$http.get('/api/forumposts/').success(function(data) {

			$scope.forumPosts = data;

			for (var i in $scope.forumPosts) {
				if (($scope.forumPosts[i].type) == 'message') {
					$scope.forumPosts[i].isMessage = true;
					$scope.forumPosts[i].isImage = false;
				} else {
					$scope.forumPosts[i].isMessage = false;
					$scope.forumPosts[i].isImage = true;
				}
			}

		});

	};

	$scope.addForumPost = function (isValid) {

	    if (isValid) {

	    	var forumMessage = '';
	    	var forumImage = '';

	    	if ($scope.postType == 'message') {
	    		forumMessage = $scope.postMessage;
	    	} else {
	    		forumImage = $scope.postMessage;
	    	}

			// Create object to be sent through the POST request
			var dataObj = {
			    user: $cookies.get('userID'),
				type: $scope.postType,
				message: forumMessage,
				image: forumImage,
				likes: 0
			};

			// Make POST request to the /petpostings
			$http.post('/api/forumposts', {data: dataObj})

				.success(function(data, status, headers, config) {

	    			refreshPosts();

				}).error(function(data, status, headers, config) {
	    			
			});

		}

	};

	$scope.likePost = function (postID) {

		if ($scope.likedPosts[postID] != true) {

	    	// Make an http put request since Angular doesn't provide update
	    	$http.put('/api/forumposts/'+ postID + '/like', {})

				.success(function(data, status, headers, config) {

					$scope.likedPosts[postID] = true;
		    		refreshPosts();

				}).error(function(data, status, headers, config) {

			});

		}

	};

}]);