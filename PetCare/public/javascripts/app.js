var app = angular.module('petCare', ['ngRoute', 'ngCookies']);

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
			controllerAs: 	'userCtrl'
		})
		.when('/users/:id/applications', {
			templateUrl: 	'/users/applications.html',
			controller: 	'applicationController',
			controllerAs: 	'appCtrl'
		})
		.when('/users/:id/messages', {
			templateUrl: 	'/users/messages.html',
			controller: 	'messageController',
			controllerAs: 	'messageCtrl'
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
		.when('/admin', {
			templateUrl: 	'/admin/admin.html',
			controller: 	'adminController',
			controllerAs: 	'adminCtrl',
			access: { restricted: false }
		})
		.otherwise({
			redirectTo: '/',
			access: { restricted: false }
		});
}]);

app.run(function ($rootScope, $location, $route, authService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
    	authService.getUserStatus();
    	if (next.access.restricted && !authService.isLoggedIn()) {
        	$location.path('/login');
        	$route.reload();
      }
  });
});

app.controller('mainController', function() {

});

// Service to share data between adminController and adminModalController in admin page
app.service('shareDataService', function() {
 	var data;

 	// Setter function that store data	
 	var setData = function(data) {
    	this.data = data;
  	};

  	// Getter function that return data to the controller
  	var getData = function(){
    	return this.data;
  	};

  	return {
    	setData: setData,
    	getData: getData
  	};

});


app.controller('adminModalController', ['$rootScope', '$http', '$scope', 'shareDataService', 
	function($rootScope, $http, $scope, shareDataService){

	// Get user Id from shared data
	// Make http request to ban the user
    $scope.ConfirmBan = function(){
    	var userID = shareDataService.getData();
    	console.log("app.js: Ban user " + userID);

    	// Creare object to be sent through the put request 
    	var dataObj = {
    		id:userID
    	}
    	
    	// Make an http put request since Angular doesn't provide update
    	$http.put('/users/'+ userID + '/ban', {data:dataObj})
			.success(function(data, status, headers, config) {
				// If update request was successful, update the view (i.e change from 'Ban' to 'Banned')
    			$('#ban-btn-'+userID).html('Banned');
			}).error(function(data, status, headers, config) {
    			console.log("error");
			});
    }

	// Make http request to delete the user
    $scope.ConfirmDelete = function(){
    	var postID   = shareDataService.getData().postingID;
    	var postType = shareDataService.getData().postingType;

    	console.log("app.js: Delete post " + postID + " from " + postType);

    	// TO-DO: Make an http delete request 
    }

}]);

app.controller('navController', ['$scope', '$location', 'authService',function($scope, $location, authService) {
	$scope.authService = authService;

	$scope.logout = function() {
		authService.logout().then(function () {
        	$location.path('/login');
        });
	};
}]);


app.controller('adminController', ['$rootScope', '$anchorScroll', '$location', '$http', '$scope', 'shareDataService', 
	function($rootScope, $anchorScroll, $location, $http, $scope, shareDataService) {
	$scope.users = [];
	$scope.petPostings = [];
	$scope.sitterPostings = [];
	$scope.reports = [];

	$scope.num_users = 0;
	$scope.num_petPostings = 0;
	$scope.num_sitterPostings = 0;
	$scope.num_reports = 0;
	$scope.num_postings = 0;

	// TODO: Format created_at dates

	$http.get('/api/users').success(function(data){
		$scope.users = data;
		$scope.num_users = Object.keys($scope.users).length;
	});

	$http.get('/api/petpostings').success(function(data){
		$scope.petPostings = data;
		$scope.num_petPostings = Object.keys($scope.petPostings).length;
		$scope.num_postings += $scope.num_petPostings;
	});

	$http.get('/api/sitterpostings').success(function(data){
		$scope.sitterPostings = data;
		$scope.num_sitterPostings = Object.keys($scope.sitterPostings).length;
		$scope.num_postings += $scope.num_sitterPostings;
	});

	$http.get('/api/reports').success(function(data){
		$scope.reports = data;
		$scope.num_reports = Object.keys($scope.reports).length;
	});

	$scope.scroll = function(anchor) {
		$location.hash(anchor);
		$anchorScroll();
	};

	// Admin Actions

	$scope.setUserId = function(userID){
		shareDataService.setData(userID);
	}

	$scope.setPostingId = function(postingType, postingID){
		// Pass arguments as one object for easier handling
		var obj = {
			postingType : postingType,
			postingID : postingID
		}
		shareDataService.setData(obj);
	}


}]);

app.controller('userController', ['$http', '$scope', function($http, $scope) {
	$scope.user = [];
	$scope.userId = 1;			//TODO: change this to session userId
	$scope.profileUserId = 2;	//TODO: change this to userId from URL
	$scope.msg_content;

	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
		console.log(data);
		$scope.user = data;
	});

	$scope.sendMsg  = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.profileUserId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
    };
}]);

app.controller('applicationController', ['$http', '$scope', function($http, $scope){
	$scope.userId = 1; // TODO: change this to session userId
	$scope.toId;
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $http.get('/applications/' + $scope.userId).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

   	$scope.sendMsg = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.toId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
    };
}]);

app.controller('messageController', ['$http', '$scope', function($http, $scope){
    $scope.userId = 1; // TODO: change this to session userId
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";

    $http.get('/messages/' + $scope.userId).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    $scope.isReadInbox = function(read) {
        if (read) {
            return 'READ';
        } else {
            return 'UNREAD';
        }
    };

    $scope.isReadSent = function(read) {
        if (read) {
            return 'SEEN';
        } else {
            return 'UNSEEN';
        }
    };

    // Update message status in database to read
    $scope.setRead = function(msgId) {
        $http.put('/read/' + msgId);
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg  = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.toId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/message', data, config);
        $scope.msg_content = "";
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

app.controller('petPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;
	$scope.msg_content = "";
	$scope.userId = 2; // TODO: change this to session userId

	// TODO: Display message if id not found

	$http.get('/api/petpostings/' + $scope.postingID).success(function(data) {

		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info

		$http.get('/api/pets/' + petID).success(function(data) {

			$scope.pet = data;
		});

	});

	$scope.ratingStar = function(id) {
		var starIndex = id;
        for (var i = 1; i <= starIndex; i++) {
            $('#star' + i).html('&#9733;');
        }
        for (var i = starIndex + 1; i <= 5; i++) {
            $('#star' + i).html('&#9734;');
        }
	};

	$scope.apply = function() {
        var data = $.param({
            from: $scope.userId,
            isPetPost: true,
            posting_id: $scope.postingID,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/application', data, config);
        $scope.msg_content = "";
	};
}]);


app.controller('sitterPostingController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
	
	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;

	$http.get('/api/sitterpostings/' + $scope.postingID).success(function(data) {

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