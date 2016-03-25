app.controller('accountController', ['$http', '$scope', '$location', function($http, $scope, $location) {
	
	$scope.register = function(email, name, password) {
		userData = {
			username: 	$scope.email, 
			password: 	$scope.password,
			name: 		$scope.name
		}
		console.log(userData);
		$http.post('/api/register', { data: userData }).success(function(data) {
			$location.path(data.redirectPath);
		});
	}
}]);

