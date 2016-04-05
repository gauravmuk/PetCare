var account = angular.module('account', []);

account.controller('accountController', ['$http', '$scope', '$location', 'authService', '$window', function($http, $scope, $location, authService, $window) {
	
	$scope.register = function(isValid, email, name, password) {
		if (isValid) {
			$scope.error = false;
	      	$scope.disabled = true;

	      	var promise = authService.register(email, password, name);

			promise.then(function() {
					$location.path('/');
					$scope.disabled = false;
				})
				.catch(function(err) {
					if (err.name == "UserExistsError") {
						$scope.errorMsg = "A user with the given email is already registered";
					}
					$scope.error = true;
					$scope.disabled = false;
			});
		}
	};

	$scope.login = function(isValid, email, password) {
		if (isValid) {
			$scope.error = false;
	      	$scope.disabled = true;
	      	console.log('res')

			authService.login(email, password)
			.then(function() {
				$location.path('/');
				$scope.disabled = false;
			})
			.catch(function(err) {
				if (err.name == "AuthenticationError") {
					$scope.errorMsg = "Incorrent email and/or password";
				}
				$scope.error = true;
				$scope.disabled = false;
			});
		}
	};

	$scope.facebook_login = function () {
		$window.location = $window.location.protocol + "//" + $window.location.host + "/auth/facebook";
	};

	$scope.twitter_login = function () {
		$window.location = $window.location.protocol + "//" + $window.location.host + "/auth/twitter";
	};
}]);