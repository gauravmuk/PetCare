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

		console.log("Review Text:" + $scope.reviewText);
		console.log("Review Star:" + this.rating);

		// TO-DO: Post Review Text and Rating to the backend server
	};
}]);

app.controller('petPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.petPosting = []
	$scope.pet = []

	$http.get('/petpostings/1').success(function(data) {
		console.log(data);
		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info
		$http.get('/pets/' + petID).success(function(data) {
			console.log(data);
			$scope.pet = data;
		});

	});

}]);


app.controller('sitterPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.sitterPosting = []

	$http.get('/sitterpostings/1').success(function(data) {
		console.log(data);
		$scope.sitterPosting = data;
	});

}]);
