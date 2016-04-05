/* Application module for viewing applications */
var application = angular.module('application', []);

application.controller('applicationController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.receivedApps = [];
    $scope.sentApps = [];

    $scope.toId; //hold recipient userId to send message
    $scope.msg_content = "";

    // get applications of the userId
    $http.get('/api/applications/' + $scope.userId + "/" + $cookies.get('token')).success(function(data){
        $scope.receivedApps = data.received;
        $scope.sentApps = data.sent;
    });

    // show read status
    $scope.isReadReceived = msgService.isReadInbox;
    $scope.isReadSent = msgService.isReadSent;

    // slide toggle for application content
    $scope.showContent = function(index) {
        $("#sent" + index).siblings(".content").slideToggle("fast", function() {});
    }

    // update read status of appId in database
    $scope.setRead = function(appId, index) {
        $http.put('/api/applications/' + appId + '/read');

        // change read status of appId in html
        $("#received" + index).find(".read").text("READ");
        $("#received" + index).find(".read").addClass("true");

        // show application content
        $("#received" + index).siblings(".content").slideToggle("fast", function() {});
    };

    // set recipient user id for sending message
    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    // send message
    $scope.sendMsg = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);
