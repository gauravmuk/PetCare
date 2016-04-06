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
					if (data.url != null) {
						thumbnail = data.url;
						sendPost(thumbnail);
					} else {
						sendPost('/assets/images/default-pet-pic.jpg');
					}

				});

		    } else {
				sendPost('/assets/images/default-pet-pic.jpg');
		    }

		}

	};

	function sendPost(userThumbnail) {

		var startDate = $scope.dt1.toString();
		var endDate = $scope.dt2.toString();

		var duration = startDate.split(' ')[1] + ' ' + startDate.split(' ')[2] + ' ' + startDate.split(' ')[3] + 
			" to " + endDate.split(' ')[1] + ' ' + endDate.split(' ')[2] + ' ' + endDate.split(' ')[3];

		// Create object to be sent through the POST request
		var dataObj = {
		    user: $cookies.get('userID'),
    		pet: $scope.inputPet,
			title: $scope.title,
			duration: duration,
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

	// Datepicker
	$scope.today = function() {
		$scope.dt1 = new Date();
		$scope.dt2 = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt1 = null;
		$scope.dt2 = null;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		minDate: new Date(),
		startingDay: 1,
    	showWeeks: true
	};

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt1 = new Date(year, month, day);
		$scope.dt2 = new Date(year, month, day);
	};

	$scope.format = 'dd MMMM yyyy';

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

}]);


pet_posting.controller('petPostingController', ['$http', '$scope', '$routeParams', '$cookies', 'appService', '$uibModal', 'authService', 'reviewService', '$location',
	function($http, $scope, $routeParams, $cookies, appService, $uibModal, authService, reviewService, $location) {

	$scope.petPosting = []
	$scope.pet = []
	$scope.postingID = $routeParams.id;
	$scope.userId = $cookies.get('userID');
	$scope.ownPost = false;
	$scope.closedPost = false;
	$scope.animationEnabled = true;
	$scope.userReviewTotal = 0;

	$scope.rating = rating;
	$scope.recomm_posts = [];

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 3;
    $scope.maxSize = 5;

    // search recommendation postings given three queries: pet type, location, and price
    $http.get("/api/petpostings/" + $cookies.get('pet') + "/" + $cookies.get('location') + "/" + $cookies.get('price') + "/" + $scope.userId).success(function(data){
        $scope.totalItems = data.length;
        $scope.currentPage = 1;

        data.sort(compare);	// sort the result postings by its rank

        // exclude current posting in recommendation
	    for (var i = 0; i < data.length; i++) {
	        if (data[i].posting_id != $scope.postingID)
	            $scope.recomm_posts.push(data[i]);
	    }

	    // pagination
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

	// switch to another posting
    $scope.showDetailPost = function(postId) {
        window.location="/pet_posts/" + postId;
    };

    $scope.closePosting = function(postId) {

        // Make PUT request to /api/petpostings/:id/close
        $http.put('/api/petpostings/' + postId + '/close', {})

            .success(function(data, status, headers, config) {

    			$scope.closedPost = true;

            }).error(function(data, status, headers, config) {
                
        });
    };

    //pagination: set current page
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    //pagination: display corresponding postings
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

    $scope.openApplyModal = function(size, isPetPost, postID) {
    	if (!authService.isLoggedIn()) {
            $location.path('/signin');
        }
        else {
            $scope.isPetPost = isPetPost;
            $scope.toPostingID = postID;
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'applyModalContent.html',
                controller: 'applyModalController',
                size: size
            });
            modalInstance.result.then(function (applicationMsg) {
                appService.apply($scope.userId, $scope.isPetPost, $scope.toPostingID, applicationMsg);
            });
        };
    };

     $scope.openReviewModal = function(size, typeOfReview, postID) {
        if (!authService.isLoggedIn()) {
            $location.path('/signin');
        }
        else {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'reviewModalContent.html',
                controller: 'userReviewModalController',
                size: size
           	});
            modalInstance.result.then(function (reviewData) {
                reviewService.sendReview(typeOfReview, reviewData.comment, reviewData.rating, postID, $scope.userId)
            });
        }
    };

    $scope.toggleAnimation = function () {
    	$scope.animationEnabled = !$scope.animationEnabled;
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
					if (data.url != null) {
						thumbnail = data.url;
						sendPet(thumbnail);
					} else {
						sendPet('/assets/images/default-pet-pic.jpg');
					}

				});

		    } else {
				sendPet('/assets/images/default-pet-pic.jpg');
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

		// Make POST request to the /pet_postings
		$http.post('/api/pets', {data: dataObj})

			.success(function(data, status, headers, config) {

    			$location.path(headers()['location']);

			}).error(function(data, status, headers, config) {
    			
		});

	};

}]);