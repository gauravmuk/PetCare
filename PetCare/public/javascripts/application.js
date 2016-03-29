var application = angular.module('application', []);

application.controller('applicationController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";


    $http.get('/api/applications/' + $scope.userId).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.isReadReceived = msgService.isReadInbox;

    $scope.isReadSent = msgService.isReadSent;

    // Update message status in database to read
    $scope.setRead = function(appId) {
        $http.put('/api/read_application/' + appId);
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);

app.factory('appService', ['$http', function($http){

    return({
        apply: apply
    });

    function apply(from, isPetPost, posting_id, content) {
        var data = $.param({
            from: from,
            isPetPost: isPetPost,
            posting_id: posting_id,
            message: content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/application', data, config);
    };
}]);
