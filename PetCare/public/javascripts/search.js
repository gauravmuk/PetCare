/* Module for search page */
var search = angular.module('search', []);

// Controller for pet_posts
search.controller('HireController', ['$http', '$scope', '$cookies', '$location', 'appService',
    function($http, $scope, $cookies, $location, appService){

    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');
    $scope.toPostingID; // posting_id holder for application
    $scope.msg_content = "";

    $scope.search_pet = function() {
        $http.get('/api/search_pet').success(function(data){
            $scope.posts = data;
        });
    };

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        $location.path("/pet_posts/" + postId);
    };

    $scope.setPostingId = function(postId) {;
        $scope.toPostingID = postId;
    }

    $scope.apply = function() {
        appService.apply($scope.userId, true, $scope.toPostingID, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);


 // Controller for petsitter_posts
search.controller('OfferController', ['$http', '$scope', '$cookies', '$location', 'appService',
    function($http, $scope, $cookies, $location, appService){

    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');
    $scope.toPostingID; // posting_id holder for application
    $scope.msg_content = "";

    $scope.search_sitter = function() {
        $http.get('/api/search_sitter').success(function(data){
            $scope.posts = data;
        });
    };

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        $location.path("/petsitter_posts/" + postId);
    };

    $scope.setPostingId = function(postId) {
        $scope.toPostingID = postId;
    }

    $scope.apply = function() {
        appService.apply($scope.userId, false, $scope.toPostingID, $scope.msg_content);
        $scope.msg_content = "";
    };
}]);

// Show rating
function rating(numOfStar, index) {
    var res = '';
    for (var i = 0; i < 5; i++) {
        if (i < numOfStar) {
            res += '&#9733;';
        } else {
            res += '&#9734;';
        }
    }
    $('#rating'+index).html(res);
}
