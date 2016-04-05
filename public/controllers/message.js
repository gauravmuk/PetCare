/* Message module for viewing messages */
var message = angular.module('message', []);

message.controller('messageController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold recipient userId to send message
    $scope.msg_content = "";

    // get messages of the userId
    $http.get('/api/messages/' + $scope.userId + "/" + $cookies.get('token')).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    // show read status
    $scope.isReadInbox = msgService.isReadInbox;
    $scope.isReadSent = msgService.isReadSent;

    // slide toggle for message content
    $scope.showContent = function(index) {
        $("#sent" + index).siblings(".content").slideToggle("fast", function() {});
    }

    // update read status of msgId in database
    $scope.setRead = function(msgId, index) {
        $http.put('/api/messages/' + msgId + '/read');

        // change read status of msgId in html
        $("#inbox" + index).find(".read").text("READ");
        $("#inbox" + index).find(".read").addClass("true");

        // show message content
        $("#inbox" + index).siblings(".content").slideToggle("fast", function() {});
    };

    // set recipient user id for sending message
    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    // send message
    $scope.sendMsg  = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);
