var pet = angular.module('pet', []);

pet.controller('petFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {
	$scope.createPet = function (){

		// Create object to be sent through the POST request
		var dataObj = {
		    user: 1,	// TODO: Use user id from session 
			name: $scope.name,
			type: $scope.type,
			breed: $scope.breed,
			gender: $scope.gender,
			age: $scope.age,	// TODO: make sure it is an integer
			description: $scope.description,
			rating: 0,
			photo: '/images/cat1.png'
		};

		// Make POST request to the /petpostings
		$http.post('/api/pets', {data: dataObj})

			.success(function(data, status, headers, config) {

    			$location.path(headers()['location']);

			}).error(function(data, status, headers, config) {
    			
		});
	};

}]);