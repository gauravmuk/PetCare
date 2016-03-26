var petsitter_posting = angular.module('petsitter_posting', []);

petsitter_posting.controller('sitterPostingFormController', ['$http', '$scope', function($http, $scope) {

	$scope.createPosting = function (){

		// Create object to be sent through the POST request
		var dataObj = {
		    user: 1,	// TODO: Use user id from session
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

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);

petsitter_posting.controller('sitterPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	
	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;

	$http.get('/api/sitterpostings/' + $scope.postingID).success(function(data) {

		$scope.sitterPosting = data;
	});

}]);