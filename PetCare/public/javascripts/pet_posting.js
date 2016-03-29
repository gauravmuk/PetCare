var pet_posting = angular.module('pet_posting', []);

pet_posting.controller('petPostingFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {

	$scope.userPets = [];
	$scope.userId = $cookies.get('userID');
	
	$http.get('/api/users/' + $scope.userId + '/pets').success(function(data) {
		$scope.userPets = data;
	});

	$scope.createPosting = function (isValid) {

		// Check if form information is valid	
	    if (isValid) {

			// Create object to be sent through the POST request
			var dataObj = {
			    user: $cookies.get('userID'),
	    		pet: 1,		// TODO: Use actual pet id
				title: $scope.title,
				duration: $scope.duration,
				location: $scope.location,
				price: $scope.price,
				supplies: $scope.supplies,
				additional_info: $scope.additional_info,
				description: $scope.description,
				thumbnail: '/images/cat1.jpg',	// TODO: Get user image
				status: 'open',
			};

			// Make POST request to the /petpostings

			$http.post('/api/petpostings', {data: dataObj})

				.success(function(data, status, headers, config) {

	    			$location.path(headers()['location']);

				}).error(function(data, status, headers, config) {
	    			
			});

		}

	};

}]);


pet_posting.controller('petPostingController', ['$http', '$scope', '$routeParams', '$cookies',
	function($http, $scope, $routeParams, $cookies) {

	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;
	$scope.msg_content = "";
	$scope.userId = $cookies.get('userID');

	$scope.rating = rating;
	$scope.recomm_posts = [];
	$scope.posts = JSON.parse($cookies.get('posts'));

    for (var i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].posting_id != $scope.postingID)
            $scope.recomm_posts.push($scope.posts[i]);
    }

	// TODO: Display message if id not found

	$http.get('/api/petpostings/' + $scope.postingID).success(function(data) {

		$scope.petPosting = data;

		// get the posting's pet number
		var petID = $scope.petPosting.pet;

		// make AJAX call to get pet info
		$http.get('/api/pets/' + petID).success(function(data) {
			$scope.pet = data;
		});

		// If user has a rating, store it
		if ($scope.petPosting.user) {
			if ($scope.petPosting.user.rating) {
				$scope.userRating = $scope.petPosting.user.rating;
			}
		}
	});

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

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        window.location="/pet_posts/" + postId;
    }
}]);

pet_posting.controller('petFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {

	$scope.createPet = function (isValid) {

		// Check if form information is valid	
	    if (isValid) {
			// Create object to be sent through the POST request
			var dataObj = {
			    user: $cookies.get('userID'),
				name: $scope.name,
				type: $scope.type,
				breed: $scope.breed,
				gender: $scope.gender,
				age: $scope.age,	// TODO: make sure it is an integer
				description: $scope.description,
				rating: 0,
				photo: '/images/cat1.jpg'
			};

			// Make POST request to the /petpostings
			$http.post('/api/pets', {data: dataObj})

				.success(function(data, status, headers, config) {

	    			$location.path(headers()['location']);

				}).error(function(data, status, headers, config) {
	    			
			});

		}

	};

}]);