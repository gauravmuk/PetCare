app.controller('accountController', ['$http', '$scope', '$location', 'authService', function($http, $scope, $location, authService) {
	
	$scope.register = function(email, name, password) {
		$scope.error = false;
      	$scope.disabled = true;

      	var promise = authService.register(email, password, name);

		promise.then(function() {
				console.log("success Register");
				$location.path('/');
				$scope.disabled = false;
			})
			.catch(function() {
				console.log("Error Register");
				$scope.error = true;
				$scope.errorMessage = "Invalid username and/or password";
				$scope.disabled = false;
		});
	};

	$scope.login = function(email, password) {
		$scope.error = false;
      	$scope.disabled = true;

		authService.login(email, password)
		.then(function() {
			console.log("success Login");
			$location.path('/');
			$scope.disabled = false;
		})
		.catch(function() {
			console.log("Error Login");
			$scope.error = true;
			$scope.errorMessage = "Invalid username and/or password";
			$scope.disabled = false;
		});
	};
}]);

