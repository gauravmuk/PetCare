/* Module for search page */
var search = angular.module('search', []);

// Controller for hire pet sitter search
search.controller('HireController', ['$http', '$scope', '$cookies', '$location',
    function($http, $scope, $cookies, $location){
    $scope.posts = [];
    $scope.rating = rating;

    $scope.search_pet = function() {
        $http.get('/api/search_pet').success(function(data){
            $scope.posts = data;
        });
    };

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        $location.path("/pet_posts/" + postId);
    };
}]);


 // Controller for offer pet sitting search
search.controller('OfferController', ['$http', '$scope', '$cookies', '$location',
    function($http, $scope, $cookies, $location){
    $scope.posts = [];
    $scope.rating = rating;

    $scope.search_sitter = function() {
        $http.get('/api/search_sitter').success(function(data){
            $scope.posts = data;
        });
    };

    $scope.showDetailPost = function(postId) {
        $cookies.put('posts', JSON.stringify($scope.posts));
        $location.path("/petsitter_posts/" + postId);
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
