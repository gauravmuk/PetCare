var review = angular.module('review', []);

review.controller('reviewController', ['$http', '$scope', function($http, $scope) {
	
	var rating;

	$scope.submitStar = function(rating){
		// Set rating to the rating level user selected
		this.rating = rating;
	}

	$scope.submitReview = function (){
		// Another way to check for undefined/null/NaN
		if(!Number.isInteger(this.rating))
			this.rating = 0;

		var reviewComment = $scope.reviewComment;
		var reviewRating = this.rating;

		// Creare object to be sent through the post request
		var dataObj = {
    		to: 1,
			from: 2,
			rating: reviewRating,
			comment: reviewComment
		}

		// Make a http post request to the server
		console.log("Make a post request to /reviews");

		$http.post('/api/reviews', {data:dataObj})

			.success(function(data, status, headers, config) {
    			// TO-DO: Get the average rating
			}).error(function(data, status, headers, config) {
    			
			});
	};
}]);