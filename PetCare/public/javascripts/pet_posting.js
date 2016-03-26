var pet_posting = angular.module('pet_posting', []);

pet_posting.controller('petPostingFormController', ['$http', '$scope', function($http, $scope) {
	$scope.createPosting = function (){

		console.log("creating pet posting");

		// Create object to be sent through the POST request
		var dataObj = {
		    user: 1,	// TODO: Use user id from session
    		pet: 1,		// TODO: Use actual pet id
			title: $scope.title,
			duration: $scope.duration,
			location: $scope.location,
			price: $scope.price,
			supplies: $scope.supplies,
			additional_info: $scope.additional_info,
			description: $scope.description,
			thumbnail: '/images/cat1.png',	// TODO: Get user image
			status: 'open',
		};

		// Make POST request to the /petpostings

		$http.post('/api/petpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);


pet_posting.controller('petPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;
	$scope.msg_content = "";
	$scope.userId = 2; // TODO: change this to session userId

	// TODO: Display message if id not found

	$http.get('/api/petpostings/' + $scope.postingID).success(function(data) {

		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info

		$http.get('/api/pets/' + petID).success(function(data) {

			$scope.pet = data;
		});

	});

	$scope.apply = function() {
        var data = $.param({
            from: $scope.userId,
            isPetPost: true,
            posting_id: $scope.postingID,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/application', data, config);
        $scope.msg_content = "";
	};
}]);