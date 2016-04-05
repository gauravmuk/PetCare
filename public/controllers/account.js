var account = angular.module('account', []);

account.controller('accountController', ['$http', '$scope', '$location', 'authService', '$window', '$rootScope',
	function($http, $scope, $location, authService, $window, $rootScope) {

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

	$scope.checkLoginStatus = function() {
		if (authService.isBanned()) {
			authService.logout();
			$scope.error = true;
			$scope.errorMsg = 'This account is banned.';
		} 
		else if ($rootScope.loginRequired){
			$scope.error = true;
			$scope.errorLoginMsg = 'Please login to continue.';
		}
	};

	$scope.checkLoginStatus();

	$scope.login = function(isValid, email, password) {
		if (isValid) {
			$scope.error = false;
	      	$scope.disabled = true;
	      	// console.log('res')

			authService.login(email, password)
			.then(function() {
				$location.path('/');
				$scope.disabled = false;
			})
			.catch(function(err) {
				if (err.name == "AuthenticationError") {
					$scope.errorMsg = "Incorrent email and/or password";
				}
				else {
					$scope.errorMsg = err;
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