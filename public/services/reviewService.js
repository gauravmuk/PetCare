app.factory('reviewService', ['$http', '$cookies', function($http, $cookies){
    return({
        sendReview: sendReview
    });

    function sendReview (typeOfReview, reviewComment, reviewRating, postID, from) {
        // Another way to check for undefined/null/NaN
        if(!Number.isInteger(reviewRating)) {
            reviewRating = 0;
        };

        // Create object to be sent through the post request
        var dataObj = {
            from: from,
            rating: reviewRating,
            comment: reviewComment,
            token: $cookies.get('token')
        };

        if (typeOfReview === 'petSitter'){
            // Make a http post request to the server
            $http.post('/api/sitter_postings/'+ postID +'/reviews', { data:dataObj })
            .success(function(data, status, headers, config) {
                
            }).error(function(data, status, headers, config) {
                
            });
        };
        
        if (typeOfReview === 'pet'){
            // Make a http post request to the server
            $http.post('/api/pet_postings/'+ postID +'/reviews', { data:dataObj })
            .success(function(data, status, headers, config) {
                
            }).error(function(data, status, headers, config) {
                
            });
        };
    };
}]);