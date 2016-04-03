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
					console.log(data);

					if (data.url != null) {
						thumbnail = data.url;
						sendPost(thumbnail);
					} else {
						sendPost('/images/default-profile-pic.png');
					}

				});

		    } else {
				sendPost('/images/default-profile-pic.png');
		    }

		}

	};

	function sendPost(userThumbnail) {

		// Create object to be sent through the POST request
		var dataObj = {
		    user: $cookies.get('userID'),
			title: $scope.title,
			types: $scope.types,
			duration: $scope.duration,
			location: $scope.location,
			price: $scope.price,
			experience: $scope.experience,
			supplies: $scope.supplies,
			number_of_pets: $scope.number_of_pets,
			description: $scope.description,
			thumbnail: userThumbnail,
			status: 'open',
		};

		// Make POST request to the /sitterpostings

		$http.post('/api/sitterpostings', {data: dataObj})

			.success(function(data, status, headers, config) {

    			$location.path(headers()['location']);

			}).error(function(data, status, headers, config) {
    			
		});

	};

}]);

petsitter_posting.controller('sitterPostingController', ['$http', '$scope', '$routeParams', '$cookies', 'appService', '$location',
	function($http, $scope, $routeParams, $cookies, appService, $location) {
	
	$scope.sitterPosting = [];
	$scope.postingID = $routeParams.id;
	$scope.userRating = 0;
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

    $http.get("/api/search_sitter/" + $cookies.get('pet') + "/" + $cookies.get('location') + "/" + $cookies.get('price') + "/" + $scope.userId).success(function(data){
        $scope.totalItems = data.length - 1;
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
	});

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        window.location="/petsitter_posts/" + postId;
    }

   	$scope.setPostingId = function(postId) {
		if (postId == -1) {
			$scope.toPostingID = $scope.postingID;
		} else {
			$scope.toPostingID = postId;
		}
	}

	$scope.apply = function() {
		appService.apply($scope.userId, false, $scope.toPostingID, $scope.msg_content);
        $scope.msg_content = "";
	};

    $scope.closePosting = function(postId) {

        // Make PUT request to /api/petpostings/:id/close
        $http.put('/api/sitterpostings/' + postId + '/close', {})

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