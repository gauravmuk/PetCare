var application = angular.module('application', []);

application.controller('applicationController', ['$http', '$scope', '$cookies', function($http, $scope, $cookies){
	$scope.userId = 1; //$cookies.get('userID');
	$scope.toId;
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $http.get('/api/applications/' + $scope.userId).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.isReadReceived = function(read) {
        if (read) {
            return 'READ';
        } else {
            return 'UNREAD';
        }
    };

    $scope.isReadSent = function(read) {
        if (read) {
            return 'SEEN';
        } else {
            return 'UNSEEN';
        }
    };

    // TODO: Update read status in backend

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