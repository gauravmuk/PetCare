/* Module for search page */
var search = angular.module('search', ['ngAnimate', 'ui.bootstrap']);

// Controller for pet_posts
search.controller('HireController', ['$http', '$scope', '$cookies', '$location', 'appService',
    function($http, $scope, $cookies, $location, appService){

    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');
    $scope.toPostingID; // posting_id holder for application
    $scope.msg_content = "";

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 5;
    $scope.maxSize = 5;

    $scope.search_pet = function() {
        $http.get('/api/search_pet').success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                }
            }

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

    //pagination
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        for (var i = 0; i < $scope.posts.length; i++) {
            if ((($scope.currentPage-1) * $scope.items_per_page <= i)
            && (i < $scope.currentPage * $scope.items_per_page)) {
                $scope.posts[i].show = true;
            } else {
                $scope.posts[i].show = false;
            }
        }
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

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 5;
    $scope.maxSize = 5;

    $scope.search_sitter = function() {
        $http.get('/api/search_sitter').success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                }
            }

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

    //pagination
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        for (var i = 0; i < $scope.posts.length; i++) {
            if ((($scope.currentPage-1) * $scope.items_per_page <= i)
            && (i < $scope.currentPage * $scope.items_per_page)) {
                $scope.posts[i].show = true;
            } else {
                $scope.posts[i].show = false;
            }
        }
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
