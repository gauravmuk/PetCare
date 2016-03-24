var app = angular.module('petCare', []);

app.controller('userController', function() {

});

app.controller('mainController', function() {
});

app.controller('userController', ['$http', '$scope', function($http, $scope) {
	$scope.user = []
	$http.get('/users/1').success(function(data){
		console.log(data);
		$scope.user = data;
	});
}]);

app.controller('reviewController', ['$http', '$scope', function($http, $scope) {
	
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
		$http.post('/reviews', {data:dataObj})
			.success(function(data, status, headers, config) {
    			// TO-DO: Get the average rating
			}).error(function(data, status, headers, config) {
    			
			});
	};
}]);

app.controller('petPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.petPosting = []
	$scope.pet = []

	$http.get('/petpostings/1').success(function(data) {
		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info
		$http.get('/pets/' + petID).success(function(data) {
			$scope.pet = data;
		});

	});

}]);


app.controller('sitterPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.sitterPosting = []

	$http.get('/sitterpostings/1').success(function(data) {
		$scope.sitterPosting = data;
	});

}]);

app.controller('sitterPostingFormController', ['$http', '$scope', function($http, $scope) {

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
		$http.post('/sitterpostings', {data: dataObj})
			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);

app.controller('petPostingFormController', ['$http', '$scope', function($http, $scope) {

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
		$http.post('/petpostings', {data: dataObj})
			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);