var user = angular.module('user', []);

user.controller('userController', ['$http', '$scope', function($http, $scope) {
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