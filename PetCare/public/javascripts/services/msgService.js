app.factory('msgService', ['$http', function($http){

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
            message: content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/message', data, config);
    };
}]);