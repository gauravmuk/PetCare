var pet_posting = angular.module('pet_posting', ['ngAnimate', 'ui.bootstrap']);

pet_posting.controller('petPostingFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {

	$scope.userPets = [];
	$scope.userId = $cookies.get('userID');
	
	// Populate user's pets
	$http.get('/api/users/' + $scope.userId + '/pets').success(function(data) {
		$scope.userPets = data;
	});

	$scope.createPosting = function (isValid) {

		// Check if form information is valid	
	    if (isValid) {

	        var file = $scope.imageFile;

	        var thumbnail = '';

	        // If user selected a file, upload it
	        if (file) {

				var fd = new FormData();
				fd.append('file', file);

				$http.post('/api/upload', fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})

				.success(function(data) {
					console.log(data);

					if (data.url != null) {
						thumbnail = data.url;
						sendPost(thumbnail);
					} else {
						sendPost('/images/cat1.jpg');
					}

				});

		    } else {
				sendPost('/images/cat1.jpg');
		    }

		}

	};

	function sendPost(userThumbnail) {

		// Create object to be sent through the POST request
		var dataObj = {
		    user: $cookies.get('userID'),
    		pet: $scope.inputPet,
			title: $scope.title,
			duration: $scope.duration,
			location: $scope.location,
			price: $scope.price,
			supplies: $scope.supplies,
			additional_info: $scope.additional_info,
			description: $scope.description,
			thumbnail: userThumbnail,
			status: 'open',
		};

		// Make POST request to the /petpostings

		$http.post('/api/petpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

    			$location.path(headers()['location']);

			}).error(function(data, status, headers, config) {
    			
		});

	};

}]);


pet_posting.controller('petPostingController', ['$http', '$scope', '$routeParams', '$cookies', 'appService',
	function($http, $scope, $routeParams, $cookies, appService) {

	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;
	$scope.toPostingID; // posting_id holder for application
	$scope.msg_content = "";
	$scope.userId = $cookies.get('userID');
	$scope.ownPost = false;
	$scope.closedPost = false;

	$scope.rating = rating;
	$scope.recomm_posts = [];

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 3;
    $scope.maxSize = 5;

    $http.get("/api/search_pet/" + $cookies.get('pet') + "/" + $cookies.get('location') + "/" + $cookies.get('price') + "/" + $scope.userId).success(function(data){
        $scope.totalItems = data.length;
        $scope.currentPage = 1;

        data.sort(compare);
	    for (var i = 0; i < data.length; i++) {
	        if (data[i].posting_id != $scope.postingID)
	            $scope.recomm_posts.push(data[i]);
	    }

        for (var i = 0; i < $scope.recomm_posts.length; i++) {
            if (i < $scope.items_per_page) {
                $scope.recomm_posts[i].show = true;
            } else {
                $scope.recomm_posts[i].show = false;
            }
        }
    });

	// TODO: Display message if id not found

	$http.get('/api/petpostings/' + $scope.postingID).success(function(data) {

		$scope.petPosting = data;

        if ($scope.petPosting.status == 'closed') {
        	$scope.closedPost = true;
        }

        if ($scope.userId == $scope.petPosting.user._id) {
        	$scope.ownPost = true;
        }

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

    $scope.showDetailPost = function(postId) {
        window.location="/pet_posts/" + postId;
    };

   	$scope.setPostingId = function(postId) {
		if (postId == -1) {
			$scope.toPostingID = $scope.postingID;
		} else {
			$scope.toPostingID = postId;
		}
	}

	$scope.apply = function() {
		appService.apply($scope.userId, true, $scope.toPostingID, $scope.msg_content);
        $scope.msg_content = "";
	};

    $scope.closePosting = function(postId) {

        // Make PUT request to /api/petpostings/:id/close
        $http.put('/api/petpostings/' + postId + '/close', {})

            .success(function(data, status, headers, config) {

    			$scope.closedPost = true;

            }).error(function(data, status, headers, config) {
                
        });
    };

    //pagination
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        for (var i = 0; i < $scope.recomm_posts.length; i++) {
            if ((($scope.currentPage-1) * $scope.items_per_page <= i)
            && (i < $scope.currentPage * $scope.items_per_page)) {
                $scope.recomm_posts[i].show = true;
            } else {
                $scope.recomm_posts[i].show = false;
            }
        }
    };
}]);

pet_posting.controller('petFormController', ['$http', '$location', '$scope', '$cookies', 
	function($http, $location, $scope, $cookies) {

	$scope.createPet = function (isValid) {

		// Check if form information is valid	
	    if (isValid) {

	        var file = $scope.imageFile;

	        var thumbnail = '';

	        // If user selected a file, upload it
	        if (file) {

				var fd = new FormData();
				fd.append('file', file);

				$http.post('/api/upload', fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})

				.success(function(data) {
					console.log(data);

					if (data.url != null) {
						thumbnail = data.url;
						sendPet(thumbnail);
					} else {
						sendPet('/images/cat1.jpg');
					}

				});

		    } else {
				sendPet('/images/cat1.jpg');
		    }

		}

	};

	function sendPet(userThumbnail) {

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
			photo: userThumbnail
		};

		// Make POST request to the /petpostings
		$http.post('/api/pets', {data: dataObj})

			.success(function(data, status, headers, config) {

    			$location.path(headers()['location']);

			}).error(function(data, status, headers, config) {
    			
		});

	};

}]);