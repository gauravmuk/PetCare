var review = angular.module('review', []);

review.controller('reviewController', ['$http', '$scope', function($http, $scope) {
	
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
    			
			}).error(function(data, status, headers, config) {
    			
			});
	};
}]);