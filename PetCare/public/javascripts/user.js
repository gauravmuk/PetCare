var user = angular.module('user', []);

user.controller('userController', ['$http', '$scope', '$routeParams', '$cookies',
    function($http, $scope, $routeParams, $cookies) {
	$scope.user = [];
	$scope.userId = $cookies.get('userID');
	$scope.profileUserId = $routeParams.id;
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