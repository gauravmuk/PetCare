app.factory('msgService', ['$http', '$cookies', function($http, $cookies){

    return({
        isReadInbox: isReadInbox,
        isReadSent: isReadSent,
        sendMsg: sendMsg
    });

    function isReadInbox(read) {
        if (read) {
            return 'READ';
        } else {
            return 'UNREAD';
        }
    };

    function isReadSent(read) {
        if (read) {
            return 'SEEN';
        } else {
            return 'UNSEEN';
        }
    };

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
        $http.post('/api/message', data, config);
    };
}]);