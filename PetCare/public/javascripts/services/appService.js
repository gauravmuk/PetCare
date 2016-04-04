app.factory('appService', ['$http', function($http){

    return({
        apply: apply
    });

    function apply(from, isPetPost, posting_id, content) {
        var data = $.param({
            from: from,
            isPetPost: isPetPost,
            posting_id: posting_id,
            message: content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http.post('/api/application', data, config);
    };
}]);
