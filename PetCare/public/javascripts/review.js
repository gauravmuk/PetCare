var review = angular.module('review', []);

review.controller('reviewController', ['$http', '$scope', '$routeParams', '$cookies', '$location', 'authService', '$location', 
	function($http, $scope, $routeParams, $cookies, $location, authService) {
	
	var rating;

	$scope.submitStar = function(rating){
		// Set rating to the rating level user selected
		this.rating = rating;
		// Note: Rating = Star Index
		var starIndex = rating;
        for (var i = 1; i <= starIndex; i++) {
            $('#star' + i).html('&#9733;');
        }
        for (var i = starIndex + 1; i <= 5; i++) {
            $('#star' + i).html('&#9734;');
        }
	}

	$scope.submitReview = function (typeOfReview){
		// Another way to check for undefined/null/NaN
		if(!Number.isInteger(this.rating))
			this.rating = 0;

		var reviewComment 	= $scope.reviewComment;
		var reviewRating 	= this.rating;
		var postID			= $routeParams.id;
		var from 			= $cookies.get('userID');

		// Create object to be sent through the post request
		var dataObj = {
			from: from,
			rating: reviewRating,
			comment: reviewComment
		}

		if (typeOfReview === 'petSitter'){
			// Make a http post request to the server
			console.log("Make a post request to /api/sitterpostings/:postID/reviews");
			$http.post('/api/sitterpostings/'+ postID +'/reviews', {data:dataObj})

			.success(function(data, status, headers, config) {
    			
			}).error(function(data, status, headers, config) {
    			
			});
		}
		
		if (typeOfReview === 'pet'){
			// Make a http post request to the server
			console.log("Make a post request to /api/petpostings/:postID/reviews");
			$http.post('/api/petpostings/'+ postID +'/reviews', {data:dataObj})

			.success(function(data, status, headers, config) {
    			
			}).error(function(data, status, headers, config) {
    			
			});
		}
		
	};
}]);