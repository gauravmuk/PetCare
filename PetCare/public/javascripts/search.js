/* Module for search page */
var search = angular.module('search', ['ngAnimate', 'ui.bootstrap']);

// Controller for pet_posts
search.controller('HireController', ['$http', '$scope', '$cookies', '$location', 'appService', 'authService',
    function($http, $scope, $cookies, $location, appService, authService){

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

    // search queries
    $scope.pet = "";
    $scope.location = "";
    $scope.min_price = "";

    navigator.geolocation.getCurrentPosition(function(position){
        var x = position.coords.latitude;
        var y = position.coords.longitude;

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true').success(function(data){
            var address_components = data.results[0].address_components;

            for(var i = 0; i < address_components.length; i++) {
                if (address_components[i].types == "locality,political") {
                    $scope.location = address_components[i].long_name;
                    break;
                }
            }

            if (authService.isLoggedIn()) {
                $scope.search_term = "Recommendations near your location.";
            } else {
                $scope.search_term = "Recommendations near " + $scope.location + ".";
            }

            $http.get("/api/search_pet/user_data/"+$scope.location+"/none/" + $scope.userId).success(function(data){
                $scope.totalItems = data.length;
                $scope.currentPage = 1;

                for (var i = 0; i < data.length; i++) {
                    if (i < $scope.items_per_page) {
                        data[i].show = true;
                    } else {
                        data[i].show = false;
                    }
                }

                data.sort(compare);
                $scope.posts = data;
                $scope.location = "";
            });
        });
    });

    $scope.search_pet = function() {
        $scope.search_term = "";
        if ($scope.pet === "")
            $scope.pet = "none";
        if ($scope.location === "")
            $scope.location = "none";
        if ($scope.min_price === "")
            $scope.min_price = "none";

        $http.get('/api/search_pet/' + $scope.pet + "/" + $scope.location + "/" + $scope.min_price + "/" + $scope.userId).success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                }
            }

            data.sort(compare);

            $scope.posts = data;
        });

        if ($scope.pet === "none")
            $scope.pet = "";
        if ($scope.location === "none")
            $scope.location = "";
        if ($scope.min_price === "none")
            $scope.min_price = "";
    };

    $scope.showDetailPost = function(postId) {
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
search.controller('OfferController', ['$http', '$scope', '$cookies', '$location', 'appService', 'authService',
    function($http, $scope, $cookies, $location, appService, authService){

    $scope.posts = [];
    $scope.rating = rating;
    $scope.userId = $cookies.get('userID');
    $scope.toPostingID; // posting_id holder for application
    $scope.msg_content = "";
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

    navigator.geolocation.getCurrentPosition(function(position){
        var x = position.coords.latitude;
        var y = position.coords.longitude;

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+x+','+y+'&sensor=true').success(function(data){
            var address_components = data.results[0].address_components;

            for(var i = 0; i < address_components.length; i++) {
                if (address_components[i].types == "locality,political") {
                    $scope.location = address_components[i].long_name;
                    break;
                }
            }

            if (authService.isLoggedIn()) {
                $scope.search_term = "Recommendations near your location.";
            } else {
                $scope.search_term = "Recommendations near " + $scope.location + ".";
            }

            $http.get("/api/search_sitter/user_data/"+$scope.location+"/none/" + $scope.userId).success(function(data){
                $scope.totalItems = data.length;
                $scope.currentPage = 1;

                for (var i = 0; i < data.length; i++) {
                    if (i < $scope.items_per_page) {
                        data[i].show = true;
                    } else {
                        data[i].show = false;
                    }
                }

                data.sort(compare);
                $scope.posts = data;
                $scope.location = "";
            });
        });
    });

    $scope.search_sitter = function() {
        $scope.search_term = "";
        if ($scope.pet === "")
            $scope.pet = "none";
        if ($scope.location === "")
            $scope.location = "none";
        if ($scope.max_price === "")
            $scope.max_price = "none";

        $http.get('/api/search_sitter/' + $scope.pet + "/" + $scope.location + "/" + $scope.max_price + "/" + $scope.userId).success(function(data){
            $scope.totalItems = data.length;
            $scope.currentPage = 1;

            for (var i = 0; i < data.length; i++) {
                if (i < $scope.items_per_page) {
                    data[i].show = true;
                } else {
                    data[i].show = false;
                }
            }

            data.sort(compare);

            $scope.posts = data;

            if ($scope.pet === "none")
                $scope.pet = "";
            if ($scope.location === "none")
                $scope.location = "";
            if ($scope.max_price === "none")
                $scope.max_price = "";
        });
    };

    $scope.showDetailPost = function(postId) {
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






//#######################
    function displayLocation(latitude,longitude){
        alert('start');
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200){
                var data = JSON.parse(request.responseText);
                alert(request.responseText); // check under which type your city is stored, later comment this line
                var addressComponents = data.results[0].address_components;
                for(i=0;i<addressComponents.length;i++){
                    var types = addressComponents[i].types
                    //alert(types);
                    if(types=="locality,political"){
                        alert(addressComponents[i].long_name); // this should be your city, depending on where you are
                    }
                }
            //alert(address.city.short_name);
            }
        };
        request.send();
    }

