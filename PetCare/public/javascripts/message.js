var message = angular.module('message', []);

message.controller('messageController', ['$http', '$scope', '$cookies', 'msgService',
    function($http, $scope, $cookies, msgService){

    $scope.userId = $cookies.get('userID');
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";

    $http.get('/api/messages/' + $scope.userId).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    $scope.isReadInbox = msgService.isReadInbox;

    $scope.isReadSent = msgService.isReadSent;

    // Update message status in database to read
    $scope.setRead = function(msgId) {
        $http.put('/api/read_msg/' + msgId);
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg  = function() {
        msgService.sendMsg($scope.userId, $scope.toId, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);


function ready() {

    // Click to show messages and applications
    $(".message .info").click(function() {

        $(this).siblings(".content").slideToggle("fast", function() {
        });
    });

    // Update read status for messages
    $(".inbox .message .info").click(function() {

        // Change message status to read
        $(this).find(".read").text("READ");
        $(this).find(".read").addClass("true");
    });

    // Update read status for messages
    $(".application .received .message .info").click(function() {

        // Change message status to read
        $(this).find(".read").text("READ");
        $(this).find(".read").addClass("true");
    });
}