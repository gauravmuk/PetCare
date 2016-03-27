var application = angular.module('application', []);

application.controller('applicationController', ['$http', '$scope', function($http, $scope){
	$scope.userId = 1; // TODO: change this to session userId
	$scope.toId;
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $http.get('/api/applications/' + $scope.userId).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

   	$scope.sendMsg = function() {
        var data = $.param({
            from: $scope.userId,
            to: $scope.toId,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/message', data, config);
        $scope.msg_content = "";
    };
}]);