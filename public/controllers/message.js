var message = angular.module('message', []);

message.controller('messageController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";

    $http.get('/api/messages/' + $scope.userId + "/" + $cookies.get('token')).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    $scope.isReadInbox = msgService.isReadInbox;

    $scope.isReadSent = msgService.isReadSent;

    $scope.showContent = function(index) {
        $("#sent" + index).siblings(".content").slideToggle("fast", function() {});
    }

    // Update message status in database to read
    $scope.setRead = function(msgId, index) {
        $http.put('/api/read_msg/' + msgId);

        // Update read status for messages
        $("#inbox" + index).find(".read").text("READ");
        $("#inbox" + index).find(".read").addClass("true");

        // show message content
        $("#inbox" + index).siblings(".content").slideToggle("fast", function() {});
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg  = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);