var application = angular.module('application', []);

application.controller('applicationController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";


    $http.get('/api/applications/' + $scope.userId + "/" + $cookies.get('token')).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    $scope.isReadReceived = msgService.isReadInbox;

    $scope.isReadSent = msgService.isReadSent;

    $scope.showContent = function(index) {
        $("#sent" + index).siblings(".content").slideToggle("fast", function() {});
    }

    // Update message status in database to read
    $scope.setRead = function(appId, index) {
        $http.put('/api/read_application/' + appId);

        // Update read status for messages
        $("#received" + index).find(".read").text("READ");
        $("#received" + index).find(".read").addClass("true");

        // show message content
        $("#received" + index).siblings(".content").slideToggle("fast", function() {});
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);