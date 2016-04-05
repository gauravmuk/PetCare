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
									 'search', 
									 'user', 
									 'forum',
									 'modal']);

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
		.when('/forum', {
			templateUrl: 	'/forum/index.html',
			controller: 	'forumController',
			controllerAs: 	'forumController',
			access: { restricted: false }
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

app.run(function ($rootScope, $location, $route, authService, activeLinkService, $window) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    authService.getUserStatus();
        activeLinkService.prepForBroadcast($location.path());
        
		if (next.access.restricted) {
			if (!authService.isLoggedIn()) {
				$rootScope.loginRequired = true;
	        	$location.path('/signin');
	        	$route.reload();
	        }
	    };
  	});
  	$rootScope.$on('$routeChangeSuccess', function (event, next, current) {   
        if (authService.isBanned()) {
        	$location.path('/signin');
        }
  	});

});

app.controller('mainController', function() {

});

app.controller('navController', ['$scope', '$location', 'authService', '$cookies', '$http', 'activeLinkService',
	function($scope, $location, authService, $cookies, $http, activeLinkService) {

	$scope.authService = authService;
	$scope.numb_new_msg = 0;
	$scope.numb_new_app = 0;

	$scope.forumActive = false;
	$scope.sitterPostingActive = false;
	$scope.petPostingActive = false;

    $scope.$on('handleBroadcast', function() {
		$scope.forumActive = activeLinkService.forumActive;
		$scope.sitterPostingActive = activeLinkService.sitterPostingActive;
		$scope.petPostingActive = activeLinkService.petPostingActive;
    });

	$scope.logout = function() {
		authService.logout().then(function () {
        	$location.path('/login');
        });
	};

	$scope.getNews = function() {

	    $http.get('/api/news/' + $cookies.get('userID')).success(function(data){
	        $scope.numb_new_msg = data.messages;
	        $scope.numb_new_app = data.applications;
	    });
	};
}]);
