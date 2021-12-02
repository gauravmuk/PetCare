/* Module for search page */
var search = angular.module('search', ['ngAnimate', 'ui.bootstrap']);

// Controller for pet_posts
search.controller('HireController', ['$http', '$scope', '$cookies', '$location', 'appService', 'authService', '$uibModal', 
    function($http, $scope, $cookies, $location, appService, authService, $uibModal){

    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 5;
    $scope.maxSize = 5;

    // search queries
    $scope.pet = "";
    $scope.location = "";
    $scope.min_price = "";

    // get default search result
    // use user's data when user is logged in.
    // use geolocation when user is not logged in.
    navigator.geolocation.getCurrentPosition(function(position){
        var x = position.coords.latitude;
        var y = position.coords.longitude;

        // get city from geolocation
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true').success(function(data){
            var address_components = data.results[0]?.address_components;

            for(var i = 0; i < address_components.length; i++) {
                if (address_components[i].types == "locality,political") {
                    $scope.location = address_components[i].long_name;
                    break;
                }
            }

            // display query for default search
            if (authService.isLoggedIn()) {
                $scope.search_term = "Recommendations near your location.";
                $scope.location = "user_data";
            } else {
                $scope.search_term = "Recommendations near " + $scope.location + ".";
            }

            // get search with default values
            $http.get("/api/petpostings/user_data/"+$scope.location+"/none/" + $scope.userId).success(function(data){
                $scope.totalItems = data.length;
                $scope.currentPage = 1;

                // sort the result postings by its rank
                data.sort(compare);

                // pagination
                for (var i = 0; i < data.length; i++) {
                    if (i < $scope.items_per_page) {
                        data[i].show = true;
                    } else {
                        data[i].show = false;
                    }
                }

                $scope.posts = data;
                $scope.location = "";
            });
        });
    });

    // get search results given three queries: pet type, location, and price
    $scope.search_pet = function() {

        // set default values to queries if not given from user
        $scope.search_term = "";
        if ($scope.pet === "")
            $scope.pet = "none";
        if ($scope.location === "")
            $scope.location = "none";
        if ($scope.min_price === "")
            $scope.min_price = "none";


        // get search result
        $http.get('/api/petpostings/' + $scope.pet + "/" + $scope.location + "/" + $scope.min_price + "/" + $scope.userId).success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            // sort the result postings by its rank
            data.sort(compare);

            // pagination
            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                }
            }

            $scope.posts = data;

            // reset queries if they were none
            if ($scope.pet === "none")
                $scope.pet = "";
            if ($scope.location === "none")
                $scope.location = "";
            if ($scope.min_price === "none")
                $scope.min_price = "";
        });
    };

    $scope.search_pet();

    // goto detail posting page
    $scope.showDetailPost = function(postId) {

        // store search queries in cookies for recommendation postings
        if ($scope.pet === "") {
            $cookies.put('pet', "none");
        } else {
            $cookies.put('pet', $scope.pet);
        }
        if ($scope.location === "") {
            $cookies.put('location', "none");
        } else {
            $cookies.put('location', $scope.location);
        }
        if ($scope.min_price === "") {
            $cookies.put('price', "none");
        } else {
            $cookies.put('price', $scope.min_price);
        }

        // switch page
        $location.path("/pet_posts/" + postId);
    };

    $scope.openApplyModal = function(size, isPetPost, postID) {
        if (!authService.isLoggedIn()) {
            $location.path('/signin');
        }
        else {
            $scope.isPetPost = isPetPost;
            $scope.toPostingID = postID;
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'applyModalContent.html',
                controller: 'applyModalController',
                size: size
            });
            modalInstance.result.then(function (applicationMsg) {
                appService.apply($scope.userId, $scope.isPetPost, $scope.toPostingID, applicationMsg);
            });
        };
    };

    $scope.toggleAnimation = function () {
        $scope.animationEnabled = !$scope.animationEnabled;
    };

    //pagination: set current page
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    //pagination: display corresponding postings
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
search.controller('OfferController', ['$http', '$scope', '$cookies', '$location', 'appService', 'authService', '$uibModal', 
    function($http, $scope, $cookies, $location, appService, authService, $uibModal){
    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');
    $scope.search_term = "";

    // pagination
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.items_per_page = 5;
    $scope.maxSize = 5;

    // search queries
    $scope.pet = "";
    $scope.location = "";
    $scope.max_price = "";

    // get default search result
    // use user's data when user is logged in.
    // use geolocation when user is not logged in.
    navigator.geolocation.getCurrentPosition(function(position){
        var x = position.coords.latitude;
        var y = position.coords.longitude;

        // get city from geolocation
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true').success(function(data){
            var address_components = data.results[0].address_components;

            for(var i = 0; i < address_components.length; i++) {
                if (address_components[i].types == "locality,political") {
                    $scope.location = address_components[i].long_name;
                    break;
                }
            }

            // display query for default search
            if (authService.isLoggedIn()) {
                $scope.search_term = "Recommendations near your location.";
                $scope.location = "user_data";
            } else {
                $scope.search_term = "Recommendations near " + $scope.location + ".";
            }

            // get search with default values
            $http.get('/api/sitterpostings/user_data/' + $scope.location+ '/none/' + $scope.userId).success(function(data){ 
                $scope.totalItems = data.length;
                $scope.currentPage = 1;

                // sort the result postings by its rank
                data.sort(compare);

                // pagination
                for (var i = 0; i < data.length; i++) {
                    if (i < $scope.items_per_page) {
                        data[i].show = true;
                    } else {
                        data[i].show = false;
                    }
                }

                $scope.posts = data;
                $scope.location = "";
            });
        });
    });

    // get search results given three queries: pet type, location, and price
    $scope.search_sitter = function() {
        // set default values to queries if not given from user
        $scope.search_term = "";
        if ($scope.pet === "")
            $scope.pet = "none";
        if ($scope.location === "")
            $scope.location = "none";
        if ($scope.max_price === "")
            $scope.max_price = "none";

        // get search result
        $http.get('/api/sitterpostings/' + $scope.pet + "/" + $scope.location + "/" + $scope.max_price + "/" + $scope.userId).success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            // sort the result postings by its rank
            data.sort(compare);

            //pagination
            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                                    }
            }

            $scope.posts = data;

            // reset queries if they were none
            if ($scope.pet === "none")
                $scope.pet = "";
            if ($scope.location === "none")
                $scope.location = "";
            if ($scope.max_price === "none")
                $scope.max_price = "";
        });
    };

    $scope.search_sitter();

    // goto detail posting page
    $scope.showDetailPost = function(postId) {

        // store search queries in cookies for recommendation postings
        if ($scope.pet === "") {
            $cookies.put('pet', "none");
        } else {
            $cookies.put('pet', $scope.pet);
        }
        if ($scope.location === "") {
            $cookies.put('location', "none");
        } else {
            $cookies.put('location', $scope.location);
        }
        if ($scope.max_price === "") {
            $cookies.put('price', "none");
        } else {
            $cookies.put('price', $scope.max_price);
        }

        // switch page
        $location.path("/petsitter_posts/" + postId);
    };

    $scope.openApplyModal = function(size, isPetPost, postID) {
        if (!authService.isLoggedIn()) {
            $location.path('/signin');
        }
        else {
            $scope.isPetPost = isPetPost;
            $scope.toPostingID = postID;
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'applyModalContent.html',
                controller: 'applyModalController',
                size: size
            });
            modalInstance.result.then(function (applicationMsg) {
                appService.apply($scope.userId, $scope.isPetPost, $scope.toPostingID, applicationMsg);
            });
        };
    };

    $scope.toggleAnimation = function () {
        $scope.animationEnabled = !$scope.animationEnabled;
    };

    //pagination: set current page
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    //pagination: display corresponding postings
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

// Return rating stars
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

// compare function for sorting
// sort in non-increasing order of rank
// if ranks are the same, sort in non-increasing order of rating
function compare(a, b) {
    if (a.rank > b.rank) {
        return -1;
    } else if (a.rank < b.rank) {
        return 1;
    } else {
        if (a.rating > b.rating) {
            return -1;
        } else if (a.rating < b.rating) {
            return 1;
        }
    }
    return 0;
}

