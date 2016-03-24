/* Module for search page */
(function() {
    var app = angular.module('search', []);

    // Controller for hire pet sitter search
    app.controller('HireController', ['$http', '$scope', function($http, $scope){
        $scope.posts = sitterPosts;

        $scope.rating = rating;
    }]);

    // Controller for offer pet sitting search
    app.controller('OfferController', ['$http', '$scope', function($http, $scope){
        $scope.posts = offerPosts;

        $scope.rating = rating;
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

})();













//####################### dummy data
var sitterPosts = [
	{
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

offerPosts = [
    {
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 2,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat1.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    },
    {
        title: 'Let me take care of your pet!',
        user_id: 1,
        price: 25,
        rate: 5,
        age: 2,
        duration: 'March 3rd to April 1st',
        pet_type: ' Cat',
        location: 'Downtown, Toronto, ON',
        image: 'images/cat2.jpg',
        description: "I'm really nice guy. You can see my reviews. Everyone satisfies with my service. 100% safety guarantees. If you'd like to bring your own food for you pet, you"
    }
]