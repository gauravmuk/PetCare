var user = angular.module('user', ['ngAnimate', 'ui.bootstrap']);

user.controller('userController', ['$http', '$scope', '$routeParams', '$cookies', '$window', '$location', '$uibModal', 'authService','msgService', 'appService',
    function($http, $scope, $routeParams, $cookies, $window, $location, $uibModal, authService, msgService, appService) {    
    	$scope.user = [];
        $scope.pets = []
        $scope.userId = $cookies.get('userID');
    	$scope.profileUserId = $routeParams.id;
        $scope.animationEnabled = true;
        
    	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
    		$scope.user = data;
    	});

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

        $http.get('/api/users/' + $scope.profileUserId + '/posts/open').success(function(data){
            $scope.open_posts = data;
        });

        $http.get('/api/users/' + $scope.profileUserId + '/posts/closed').success(function(data){
            $scope.closed_posts = data;
        });

         $http.get('/api/users/' + $scope.profileUserId + '/reviews').success(function(data){
            $scope.reviews = data;
            $scope.userReviewTotal = data.length;
        });

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

        $scope.sendMsg = function() {
            msgService.sendMsg($scope.userId, $scope.profileUserId, $scope.message);
        };

        $scope.sendApplication = function() {
            appService.apply($scope.userId, $scope.isPetPost, $scope.toPostingID, $scope.applicationMsg);
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
            $http.post('/api/reports/', {data:dataObj})
                .success(function(data, status, headers, config) {
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
                    controller: 'messageUserController',
                    size: size
                });
                modalInstance.result.then(function (message) {
                    $scope.message = message;
                    $scope.sendMsg();
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
                    controller: 'reportUserController',
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
                    controller: 'applyController',
                    size: size
                });
                modalInstance.result.then(function (applicationMsg) {
                    $scope.applicationMsg = applicationMsg;
                    $scope.sendApplication();
                });
            };
        };

        $scope.openPetReviewModal = function(size, reviews) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'petReviewModalContent.html',
                controller: 'petReviewController',
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

        $scope.toggleAnimation = function () {
            $scope.animationEnabled = !$scope.animationEnabled;
        };
    }
]);

user.controller('messageUserController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.message);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

user.controller('reportUserController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.reportMsg);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

user.controller('applyController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.applicationMsg);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

user.controller('petReviewController', ['$http', '$scope', '$uibModalInstance', 'reviews',
    function($http, $scope, $uibModalInstance, reviews) {
        $scope.reviews = reviews;
        console.log(reviews)
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.range = function(value) {
            var ratings = [];
            for (var i = 1; i <= value; i++) {
                ratings.push(i)
            }
            return ratings
        };
}]);
