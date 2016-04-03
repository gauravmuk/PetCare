var user = angular.module('user', []);

user.controller('userController', ['$http', '$scope', '$routeParams', '$cookies', '$window', 'msgService',
    function($http, $scope, $routeParams, $cookies, $window, msgService) {    
	$scope.user = [];
    $scope.pets = []
	$scope.profileUserId = $routeParams.id;
	$scope.msg_content = "";

	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
		$scope.user = data;
	});

    $http.get('/api/users/' + $scope.profileUserId + '/pets').success(function(data){
        $scope.pets = data;
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


	$scope.sendMsg  = function() {
        msgService.sendMsg($scope.userId, $scope.profileUserId, $scope.msg_content);
        $scope.msg_content = "";
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
        var reportMsg   = $scope.reportMsgText;

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

    if ($window.location.hash == '#review') {
        $scope.selected = 'review';
    } else {
        $scope.selected = 'pet';
    }

    $scope.checkDisplayStyle = function(section) {
        if ($scope.selected == section) {
            return { 'display': 'block' };
        }
        else {
            return { 'display': 'none' };
        }
    }

    $scope.checkTitleStyle = function(section) {
        if ($scope.selected == section) {
            return { 'color' : '#006e8c' };
        }
        else {
            return { 'color' : '#929292' };
        }
    }
}]);
