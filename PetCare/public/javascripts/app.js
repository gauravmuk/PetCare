var app = angular.module('petCare',	['ngRoute', 
									 'ngCookies', 
									 'ngMessages',
									 'admin', 
									 'account', 
									 'application', 
									 'message',
									 'user', 
									 'pet_posting',
									 'petsitter_posting',
									 'review',
									 'search', 
									 'user']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 	'/layouts/home.html',
			controller: 	'mainController',
			controllerAs: 	'mainCtrl',
			access: { restricted: false}
		})
		.when('/users/:id', {
			templateUrl: 	'/users/show.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl',
			access: { restricted: false}
		})
		.when('/users/:id/applications', {
			templateUrl: 	'/users/applications.html',
			controller: 	'applicationController',
			controllerAs: 	'appCtrl',
			access: { restricted: false}
		})
		.when('/users/:id/messages', {
			templateUrl: 	'/users/messages.html',
			controller: 	'messageController',
			controllerAs: 	'messageCtrl',
			access: { restricted: false}
		})
		.when('/signin', {
			templateUrl: 	'/signin.html',
			controller: 	'accountController',
			controllerAs: 	'accountCtrl',
			access: { restricted: false }
		})
		.when('/signup', {
			templateUrl: 	'/signup.html',
			controller: 	'accountController',
			controllerAs: 	'accountCtrl',
			access: { restricted: false }
		})
		.when('/signout', {
			controller: 	'accountController',
			controllerAs: 	'accountCtrl',
			access: { restricted: true }
		})
		.when('/pet_posts', {
			templateUrl: 	'/pet_posts/index.html',
			controller: 	'HireController',
			controllerAs: 	'HireCtrl',
			access: { restricted: false }
		})
		.when('/new_pet_posts', {
			templateUrl: 	'/pet_posts/new.html',
			controller: 	'petPostingFormController',
			controllerAs: 	'petPostingFormCtrl',
			access: { restricted: true }

		})
		.when('/pet_posts/:id', {
			templateUrl: 	'/pet_posts/show.html',
			controller: 	'petPostingController',
			controllerAs: 	'petPostingCtrl',
			access: { restricted: false }
		})
		.when('/petsitter_posts', {
			templateUrl: 	'/petsitter_posts/index.html',
			controller: 	'OfferController',
			controllerAs: 	'OfferCtrl',
			access: { restricted: false }
		})
		.when('/petsitter_posts/:id', {
			templateUrl: 	'/petsitter_posts/show.html',
			controller: 	'sitterPostingController',
			controllerAs: 	'sitterPostingCtrl',
			access: { restricted: false }
		})
		.when('/new_petsitter_posts', {
			templateUrl: 	'/petsitter_posts/new.html',
			controller: 	'sitterPostingFormController',
			controllerAs: 	'sitterPostingFormController',
			access: { restricted: true }
		})
		.when('/new_pet', {
			templateUrl: 	'/pet/new.html',
			controller: 	'petFormController',
			controllerAs: 	'petFormController',
			access: { restricted: true }
		})
		.when('/admin', {
			templateUrl: 	'/admin/admin.html',
			controller: 	'adminController',
			controllerAs: 	'adminCtrl',
			access: { restricted: true }
		})
		.otherwise({
			redirectTo: '/',
			access: { restricted: false }
		});
}]);

app.run(function ($rootScope, $location, $route, authService) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    authService.getUserStatus();
		if (next.access.restricted) {
			if (!authService.isLoggedIn()) {
	        	$location.path('/signin');
	        	$route.reload();
	        }
	    };
  	});
});

app.controller('mainController', function() {

});

app.controller('navController', ['$scope', '$location', 'authService',function($scope, $location, authService) {
	$scope.authService = authService;

	$scope.logout = function() {
		authService.logout().then(function () {
        	$location.path('/login');
        });
	};
}]);

// call jQuery functions after rendering finishes
app.directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                ready();
            }
        }
    };
});