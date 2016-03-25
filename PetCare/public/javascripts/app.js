var app = angular.module('petCare', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			templateUrl: 	'/layouts/home.html',
			controller: 	'mainController',
			controllerAs: 	'mainCtrl'
		})
		.when('/users/:id', {
			templateUrl: 	'/users/show.html',
			controller: '	userController',
			controllerAs: 	'userCtrl'
		})
		.when('/users/:id/applications', {
			templateUrl: 	'/users/applications.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/users/:id/messages', {
			templateUrl: 	'/users/messages.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/signin', {
			templateUrl: 	'/signin.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/signup', {
			templateUrl: 	'/signup.html',
			controller: 	'userController',
			controllerAs: 	'userCtrl'
		})
		.when('/pet_posts', {
			templateUrl: 	'/pet_posts/index.html',
			controller: 	'HireController',
			controllerAs: 	'HireCtrl'
		})
		.when('/new_pet_posts', {
			templateUrl: 	'/pet_posts/new.html',
			controller: 	'petPostingFormController',
			controllerAs: 	'petPostingFormCtrl'
		})
		.when('/pet_posts/:id', {
			templateUrl: 	'/pet_posts/show.html',
			controller: 	'petPostingController',
			controllerAs: 	'petPostingCtrl'
		})
		.when('/petsitter_posts', {
			templateUrl: 	'/petsitter_posts/index.html',
			controller: 	'OfferController',
			controllerAs: 	'OfferCtrl'
		})
		.when('/petsitter_posts/:id', {
			templateUrl: 	'/petsitter_posts/show.html',
			controller: 	'sitterPostingController',
			controllerAs: 	'sitterPostingCtrl'
		})
		.when('/new_petsitter_posts', {
			templateUrl: 	'/petsitter_posts/new.html',
			controller: 	'sitterPostingFormController',
			controllerAs: 	'sitterPostingFormController'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

app.controller('mainController', function() {
});

app.controller('adminController', function() {

});

app.controller('userController', ['$http', '$scope', function($http, $scope) {
	$scope.user = []
	$http.get('/api/users/1').success(function(data){
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

		$http.post('/api/reviews', {data:dataObj})

			.success(function(data, status, headers, config) {
    			// TO-DO: Get the average rating
			}).error(function(data, status, headers, config) {
    			
			});
	};
}]);

app.controller('petPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.petPosting = []
	$scope.pet = []


	$http.get('/api/petpostings/1').success(function(data) {

		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info

		$http.get('/api/pets/' + petID).success(function(data) {

			$scope.pet = data;
		});

	});

}]);


app.controller('sitterPostingController', ['$http', '$scope', function($http, $scope) {
	
	$scope.sitterPosting = []


	$http.get('/api/sitterpostings/1').success(function(data) {

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

		$http.post('/api/sitterpostings', {data: dataObj})

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

		$http.post('/api/petpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config) {
    			
			});
	};

}]);

app.controller('HireController', ['$http', '$scope', function($http, $scope){
        $scope.posts = sitterPosts;

        $scope.rating = rating;
}]);

// Controller for offer pet sitting search
app.controller('OfferController', ['$http', '$scope', function($http, $scope){
    $scope.posts = offerPosts;

    $scope.rating = rating;
}]);

// Show rating
function rating(numOfStar, index) {
    var res = '';
    for (var i = 0; i < 5; i++) {
        if (i < numOfStar) {
        	res += '&#9733;';
        } else {
        	res += '&#9734;';
        }
    }
    $('#rating'+index).html(res);
}

//####################### dummy data
var sitterPosts = [
	{	
		id: 1,
		title: 'Let me take care of your pet!',
		user_id: 1,
		price_range: '20 ~ 25',
		rate: 2,
		experience: '2 years experience',
		duration: 'March 3rd to April 1st',
		pet_types: ' Cats, Dogs, Hampsters',
		location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
		description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
	},
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price_range: '20 ~ 25',
        rate: 4,
        experience: '2 years experience',
        duration: 'March 3rd to April 1st',
        pet_types: ' Cats, Dogs, Hampsters',
        location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]

offerPosts = [
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 2,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat1.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    },
    {
    	id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 5,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat2.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]