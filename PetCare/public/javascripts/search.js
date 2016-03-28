/* Module for search page */
var search = angular.module('search', []);

    // Controller for hire pet sitter search
search.controller('HireController', ['$http', '$scope', function($http, $scope){
    $scope.posts = sitterPosts;
    $scope.rating = rating;
}]);

    // Controller for offer pet sitting search
search.controller('OfferController', ['$http', '$scope', function($http, $scope){
    $scope.posts = [];
    $scope.rating = rating;

    $http.get('/api/search_pet').success(function(data){
        $scope.posts = data;
    });
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

//####################### dummy data
var sitterPosts = [
	{
        id: 1,
		title: 'Let me take care of your pet!',
		user_id: 1,
		price_range: '20 ~ 25',
		rate: 2,
		experience: '2 years experience',
		duration: 'March 3rd to April 1st',
		pet_types: ' Cats, Dogs, Hampsters',
		location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
		description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
	},
    {
        id: 1,
        title: 'Let me take care of your pet!',
        user_id: 1,
        price_range: '20 ~ 25',
        rate: 4,
        experience: '2 years experience',
        duration: 'March 3rd to April 1st',
        pet_types: ' Cats, Dogs, Hampsters',
        location: 'Downtown, Toronto, ON',
        image: 'images/default-profile-pic.png',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]

