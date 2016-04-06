var petsitter_posting = angular.module('petsitter_posting', ['ngAnimate', 'ui.bootstrap']);

petsitter_posting.controller('sitterPostingFormController', ['$http', '$location', '$scope', '$cookies',
	function($http, $location, $scope, $cookies) {

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
						sendPost('/assets/images/default-profile-pic.png');
					}

				});

		    } else {
				sendPost('/assets/images/default-profile-pic.png');
		    }

		}

	};

	function sendPost(userThumbnail) {

		var startDate = $scope.dt1.toString();
		var endDate = $scope.dt2.toString();

		var duration = startDate.split(' ')[1] + ' ' + startDate.split(' ')[2] + ' ' + startDate.split(' ')[3] + 
			" to " + endDate.split(' ')[1] + ' ' + endDate.split(' ')[2] + ' ' + endDate.split(' ')[3];

		var priceString = $scope.priceLow + " - " + $scope.priceHigh;

		// Create object to be sent through the POST request
		var dataObj = {
		    user: $cookies.get('userID'),
			title: $scope.title,
			types: $scope.types,
			duration: duration,
			location: $scope.location,
			price: priceString,
			experience: $scope.experience,
			supplies: $scope.supplies,
			number_of_pets: $scope.number_of_pets,
			description: $scope.description,
			thumbnail: userThumbnail,
			status: 'open',
		};

		// Make POST request to the /sitter_postings

		$http.post('/api/sitterpostings', {data: dataObj})

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

petsitter_posting.controller('sitterPostingController', 
	['$http', '$scope', '$routeParams', '$cookies', 'appService', '$location', '$uibModal', 'authService', 'reviewService',
	function($http, $scope, $routeParams, $cookies, appService, $location, $uibModal, authService, reviewService) {

	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;
	$scope.userRating = 0;
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
    $http.get("/api/sitterpostings/" + $cookies.get('pet') + "/" + $cookies.get('location') + "/" + $cookies.get('price') + "/" + $scope.userId).success(function(data){
        $scope.totalItems = data.length - 1;
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

	$http.get('/api/sitterpostings/' + $scope.postingID).success(function(data) {

		$scope.sitterPosting = data;

        if ($scope.sitterPosting.status == 'closed') {
        	$scope.closedPost = true;
        }

        if ($scope.userId == $scope.sitterPosting.user._id) {
        	$scope.ownPost = true;
        }

		// If user has a rating, store it
		if ($scope.sitterPosting.user) {
			if ($scope.sitterPosting.user.rating) {
				$scope.userRating = $scope.sitterPosting.user.rating;
			}
		}

	    $http.get('/api/users/' + $scope.sitterPosting.user._id + '/reviews').success(function(data) {
	        $scope.userReviewTotal = data.length;
	    });
	});

	// switch to another posting
    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        window.location="/petsitter_posts/" + postId;
    }

    $scope.closePosting = function(postId) {
        // Make PUT request to /api/petpostings/:id/:status
        $http.put('/api/sitterpostings/' + postId + '/close', {})

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


// Tutorial link: http://www.tutorialspoint.com/angularjs/angularjs_upload_file.htm
app.directive('fileModel', ['$parse', function ($parse) {
	return {
	   restrict: 'A',
	   link: function(scope, element, attrs) {
	      var model = $parse(attrs.fileModel);
	      var modelSetter = model.assign;
	      
	      element.bind('change', function(){
	         scope.$apply(function(){
	            modelSetter(scope, element[0].files[0]);
	         });
	      });
	   }
	};
}]);