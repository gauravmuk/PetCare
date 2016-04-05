// Message service for sending messages
app.factory('msgService', ['$http', '$cookies', function($http, $cookies){

    return({
        isReadInbox: isReadInbox,
        isReadSent: isReadSent,
        sendMsg: sendMsg
    });

    // display read status for inbox messages
    function isReadInbox(read) {
        if (read) {
            return 'READ';
        } else {
            return 'UNREAD';
        }
    };

    // display read status for sent messages
    function isReadSent(read) {
        if (read) {
            return 'SEEN';
        } else {
            return 'UNSEEN';
        }
    };

    // post message
    function sendMsg(from, to, content) {
        var data = $.param({
            from: from,
            to: to,
            message: content,
            token: $cookies.get('token')
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/messages', data, config);
    };
}]);