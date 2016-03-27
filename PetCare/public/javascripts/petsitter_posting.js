var petsitter_posting = angular.module('petsitter_posting', []);

petsitter_posting.controller('sitterPostingFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {

	$scope.createPosting = function (isValid){

		// Check if form information is valid	
	    if (isValid) {

			// Create object to be sent through the POST request
			var dataObj = {
			    user: $cookies.get('userID'),
				title: $scope.title,
				types: $scope.types,
				duration: $scope.duration,
				location: $scope.location,
				price: $scope.price,
				experience: $scope.experience,
				supplies: $scope.supplies,
				number_of_pets: $scope.number_of_pets,
				description: $scope.description,
				thumbnail: '/images/default-profile-pic.png',	// TODO: Get user image
				status: 'open',
			};

			// Make POST request to the /sitterpostings

			$http.post('/api/sitterpostings', {data: dataObj})

				.success(function(data, status, headers, config) {

	    			$location.path(headers()['location']);

				}).error(function(data, status, headers, config) {
	    			
			});

		}

	};

}]);

petsitter_posting.controller('sitterPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	
	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;
	$scope.userRating = 0;

	$http.get('/api/sitterpostings/' + $scope.postingID).success(function(data) {

		$scope.sitterPosting = data;

		// If user has a rating, store it
		if ($scope.sitterPosting.user) {
			if ($scope.sitterPosting.user.rating) {
				$scope.userRating = $scope.sitterPosting.user.rating;
			}
		}

	    for (var i = 1; i <= $scope.userRating; i++) {
	        $('.user_info #star' + i).html('&#9733;');
	    }
	    for (var i = $scope.userRating + 1; i <= 5; i++) {
	        $('.user_info #star' + i).html('&#9734;');
	    }

	});


}]);