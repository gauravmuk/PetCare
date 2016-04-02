var account = angular.module('account', []);

account.controller('accountController', ['$http', '$scope', '$location', 'authService', '$window', function($http, $scope, $location, authService, $window) {
	
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

	$scope.facebook_login = function () {
		$window.location = $window.location.protocol + "//" + $window.location.host + "/auth/facebook";
	};

	$scope.twitter_login = function () {
		$window.location = $window.location.protocol + "//" + $window.location.host + "/auth/twitter";
	};
}]);