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

	$scope.submitReview = function (){
		console.log("submitReview");
	};
}]);
