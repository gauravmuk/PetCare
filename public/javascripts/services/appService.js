app.factory('appService', ['$http','$cookies', function($http, $cookies){

    return({
        apply: apply
    });

    function apply(from, isPetPost, posting_id, content) {
        var data = $.param({
            from: from,
            isPetPost: isPetPost,
            posting_id: posting_id,
            message: content,
            token: $cookies.get('token')
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/application', data, config);
    };
}]);
