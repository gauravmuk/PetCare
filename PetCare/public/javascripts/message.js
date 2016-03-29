var message = angular.module('message', []);

message.controller('messageController', ['$http', '$scope', '$cookies', function($http, $scope, $cookies){
    $scope.userId = 1; //$cookies.get('userID');
    $scope.inbox = [];
    $scope.sent = [];

    $scope.toId; //hold userId to send message
    $scope.msg_content = "";

    $http.get('/api/messages/' + $scope.userId).success(function(data){
        $scope.inbox = data.inbox;
        $scope.sent = data.sent;
    });

    $scope.isReadInbox = function(read) {
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

    // Update message status in database to read
    $scope.setRead = function(msgId) {
        $http.put('/api/read/' + msgId);
    };

    $scope.reply = function(userId) {
        $scope.toId = userId;
    };

    $scope.sendMsg  = function() {
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