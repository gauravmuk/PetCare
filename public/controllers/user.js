var user = angular.module('user', ['ngAnimate', 'ui.bootstrap']);

user.controller('userController', ['$http', '$scope', '$routeParams', '$cookies', '$window', '$location', '$uibModal', 'authService','msgService', 'appService',
    function($http, $scope, $routeParams, $cookies, $window, $location, $uibModal, authService, msgService, appService) {    
    	$scope.user = [];
        $scope.pets = []
        $scope.userId = $cookies.get('userID');
    	$scope.profileUserId = $routeParams.id;
        $scope.animationEnabled = true;
        $scope.editMode = false;

    	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
    		$scope.user = data;
            $scope.setUserData(data);
    	});

        $scope.getPetData = function() {
            $http.get('/api/users/' + $scope.profileUserId + '/pets').success(function(data){
                $scope.pets = data;
                if ($window.location.hash == '#review') {
                    $scope.selected = 'review';
                }
                else {
                    $scope.selected = 'pet';
                    var petID = $window.location.hash.match(/\d+/g);
                    if (petID) {
                        for (i = 0; i < data.length; i++) {
                            if (petID[0] == $scope.pets[i]._id) {
                                $scope.openPetReviewModal('lg', $scope.pets[i].reviews);
                            }
                        }
                    }
                };
            });
        };

        $scope.getPetData();

        refreshOpenedPost();
        refreshClosedPost();

        $http.get('/api/users/' + $scope.profileUserId + '/reviews').success(function(data){
            $scope.reviews = data;
            $scope.userReviewTotal = data.length;
        });

        $scope.uploadUserImage = function (imageFile) {
            // If user selected a file, upload it
            if (imageFile) {

                var fd = new FormData();
                fd.append('file', imageFile.files[0]);

                $http.post('/api/upload', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(data) {
                    // console.log(data.url)
                    if (data.url != null) {
                        $scope.editUserData.photo = data.url;
                    }
                });
            }   
        };

        $scope.toggleEditMode = function() {
            $scope.editMode = !$scope.editMode;
        }

        $scope.exitEditMode = function(type) {
            $scope.toggleEditMode()
            if (type == "save") {
                $http.put('/api/users/' + $scope.profileUserId, { data: $scope.editUserData }).success(function(data){
                    $scope.user = data;
                    $scope.setUserData(data);
                    authService.setUserData(data.name);
                })
            } else {
                $scope.setUserData($scope.user);
            };
        };

        $scope.setUserData = function(data) {
            $scope.editUserData = { name:           data.name, 
                                    location:       data.location, 
                                    email:          data.email, 
                                    description:    data.description,
                                    photo:          data.photo 
            };
        };

        $scope.isNumber = function(value) {
            return /^\d+$/.test(value);
        };

        $scope.range = function(value) {
            var ratings = [];
            for (var i = 1; i <= value; i++) {
                ratings.push(i)
            }
            return ratings
        };

        $scope.sendReport = function() {
            // Get user IDs of user who is making the report and the ID of the user reporting against 
            var from            = $cookies.get('userID');
            var to              = $routeParams.id;
            // Get the report text
            var reportMsg   = $scope.reportMsg;

            // Create object to be sent through the post request
            var dataObj = {
                from: from,
                to: to,
                reportMsg: reportMsg
            }

            // Make http post request to the server
            $http.post('/api/reports/', { data:dataObj })
                .success(function(data, status, headers, config) {
                }).error(function(data, status, headers, config) {
            });
        };

        $scope.createPet = function (pet, isValid, imageFile) {
            // Check if form information is valid   
            if (isValid) {
                var file = imageFile;

                // If user selected a file, upload it
                if (file) {
                    var fd = new FormData();
                    fd.append('file', file);

                    $http.post('/api/upload', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(data) {
                        // console.log(data);
                        if (data.url != null) {
                            thumbnail = data.url;
                            editPet(pet, thumbnail);
                        }
                    });
                }
                else {
                    editPet(pet, null);
                }
            }

        };

        function editPet(pet, petThumbnail) {
            // Create object to be sent through the POST request
            var dataObj = {
                name:           pet.name,
                type:           pet.type,
                breed:          pet.breed,
                gender:         pet.gender,
                age:            pet.age,
                description:    pet.description,
            };
            if (petThumbnail) {
                dataObj.photo = petThumbnail;
            }
            debugger

            //Make POST request to the /petpostings
            $http.put('/api/pets/' + pet.id, { data: dataObj })
                .success(function(data, status, headers, config) {
                    $scope.getPetData();
                }).error(function(data, status, headers, config) {
                    
            });

        };

        $scope.select = function(section) {
            $scope.selected = section;
        }

        $scope.checkDisplayStyle = function(section) {
            if ($scope.selected == section) {
                return { 'display': 'block' };
            }
            else {
                return { 'display': 'none' };
            }
        };

        $scope.checkTitleStyle = function(section) {
            if ($scope.selected == section) {
                return { 'color' : '#006e8c' };
            }
            else {
                return { 'color' : '#929292' };
            }
        };

        $scope.openMessageModal = function(size) {
            if (!authService.isLoggedIn()) {
                $location.path('/signin');
            }
            else {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationEnabled,
                    templateUrl: 'messageModalContent.html',
                    controller: 'messageUserModalController',
                    size: size
                });
                modalInstance.result.then(function (message) {
                    msgService.sendMsg($scope.userId, $scope.profileUserId, message);
                });
            };
        };

        $scope.openReportModal = function(size) {
            if (!authService.isLoggedIn()) {
                $location.path('/signin');
            }
            else {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationEnabled,
                    templateUrl: 'reportModalContent.html',
                    controller: 'reportUserModalController',
                    size: size
                });
                modalInstance.result.then(function (reportMsg) {
                    $scope.reportMsg = reportMsg;
                    $scope.sendReport();
                });
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

        $scope.openPetReviewModal = function(size, reviews) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'petReviewModalContent.html',
                controller: 'petReviewModalController',
                size: size,
                resolve: {
                    reviews: function() {
                        return reviews;
                    }
                }
            });
            modalInstance.result.then(function () {
            });
        };

        $scope.openEditPetModal = function(size, pet) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'editPetModalContent.html',
                controller: 'editPetModalController',
                size: size,
                resolve: {
                    pet: function() {
                        return {    id:             pet._id,
                                    name:           pet.name,
                                    breed:          pet.breed,
                                    type:           pet.type,
                                    age:            pet.age,
                                    gender:         pet.gender,
                                    description:    pet.description
                        };
                    }
                }
            });
            modalInstance.result.then(function (petData) {
                $scope.createPet(petData.pet, petData.isValid, petData.file);
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationEnabled = !$scope.animationEnabled;
        };

        // Make http DELETE requests for the given post ids
        $scope.deletePost = function (postID, postingType) {
            

            // If type is sitterPosting, make an API call to delete /api/sitterpostings/:id
            if (postingType === 'sitterPosting'){
                // Make an http delete request to delete post with a given id
                $http.delete('/api/sitterpostings/'+ postID)
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                    }).error(function(data, status, headers, config) {

                    });
            }
            // If type is pet_posting, make an API call to delete /api/petpostings/:id
            if(postingType === 'petPosting'){
                // Make an http delete request to delete post with a given id
                $http.delete('/api/petpostings/'+ postID)
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                    }).error(function(data, status, headers, config) {

                    });
            } 

        };

        // Make http PUT requests for the given post idsto close it
        $scope.closePost = function (postID, postingType) {
            
            // If type is sitterPosting, make an API call to chage status to 'close'
            if (postingType === 'sitterPosting'){
                // Make an http delete request to delete post with a given id
                $http.put('/api/sitterpostings/' + postID + '/close')
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                        refreshClosedPost();
                    }).error(function(data, status, headers, config) {

                    });
            }
            // If type is pet_posting, make an API call to chage status to 'close'
            if(postingType === 'petPosting'){
                // Make an http delete request to delete post with a given id
                $http.put('/api/petpostings/' + postID + '/close')
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                        refreshClosedPost();
                    }).error(function(data, status, headers, config) {

                    });
            } 

        };
        
        // Make http PUT requests for the given post id to open it
        $scope.reopenPost = function (postID, postingType) {
            console.log(postingType);

            // If type is sitterPosting, make an API call to chage status to 'close'
            if (postingType === 'sitterPosting'){
                // Make an http delete request to delete post with a given id
                $http.put('/api/sitterpostings/' + postID + '/open')
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                        refreshClosedPost();
                    }).error(function(data, status, headers, config) {

                    });
            }
            // If type is pet_posting, make an API call to chage status to 'close'
            if(postingType === 'petPosting'){
                // Make an http delete request to delete post with a given id
                $http.put('/api/petpostings/' + postID + '/open')
                    .success(function(data, status, headers, config) {
                        refreshOpenedPost();
                        refreshClosedPost();
                    }).error(function(data, status, headers, config) {

                    });
            } 

        };


        function refreshOpenedPost (){
            $http.get('/api/users/' + $scope.profileUserId + '/posts/open').success(function(data){
                $scope.open_posts = data;

                // exclude current posting in recommendation
                for (var i = 0; i < $scope.open_posts.length; i++) {
                    if ($scope.open_posts[i].pet) {
                        $scope.open_posts[i].postingType = 'petPosting';
                    } else {
                        $scope.open_posts[i].postingType = 'sitterPosting';
                    }
                }
            });
        }

        function refreshClosedPost (){
            $http.get('/api/users/' + $scope.profileUserId + '/posts/closed').success(function(data){
                $scope.closed_posts = data;

                // exclude current posting in recommendation
                for (var i = 0; i < $scope.closed_posts.length; i++) {
                    if ($scope.closed_posts[i].pet) {
                        $scope.closed_posts[i].postingType = 'petPosting';
                    } else {
                        $scope.closed_posts[i].postingType = 'sitterPosting';
                    }
                }
                
            });
        }
    }
]);