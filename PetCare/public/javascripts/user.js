var user = angular.module('user', []);

user.controller('userController', ['$http', '$scope', '$routeParams', '$cookies', 'msgService',
    function($http, $scope, $routeParams, $cookies, msgService) {
	$scope.user = [];
	$scope.userId = $cookies.get('userID');
	$scope.profileUserId = $routeParams.id;
	$scope.msg_content = "";

	$http.get('/api/users/' + $scope.profileUserId).success(function(data){
		console.log(data);
		$scope.user = data;
	});

	$scope.sendMsg  = function() {
        msgService.sendMsg($scope.userId, $scope.profileUserId, $scope.msg_content);
        $scope.msg_content = "";
    };

    $scope.sendReport = function() {
        // Get user IDs of user who is making the report and the ID of the user reporting against 
        var from            = $cookies.get('userID');
        var to              = $routeParams.id;
        // Get the report text
        var reportMsg   = $scope.reportMsgText;

        console.log("from " + from);
        console.log("to " + to);

        // Create object to be sent through the post request
        var dataObj = {
            from: from,
            to: to,
            reportMsg: reportMsg
        }

        console.log(dataObj);

        // Make http post request to the server
        $http.post('/api/reports/', {data:dataObj})
            .success(function(data, status, headers, config) {
            }).error(function(data, status, headers, config) {
            });
    }

}]);
