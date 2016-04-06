var modal = angular.module('modal', ['ngAnimate', 'ui.bootstrap']);

modal.controller('messageUserModalController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.message);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);


modal.controller('reportUserModalController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.reportMsg);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);


modal.controller('applyModalController', ['$http', '$scope', '$uibModalInstance', 
    function($http, $scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope.applicationMsg);
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

modal.controller('petReviewModalController', ['$http', '$scope', '$uibModalInstance', 'reviews',
    function($http, $scope, $uibModalInstance, reviews) {
        $scope.reviews = reviews;
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.range = function(value) {
            var ratings = [];
            for (var i = 1; i <= value; i++) {
                ratings.push(i)
            }
            return ratings
        };
}]);

modal.controller('editPetModalController', ['$http', '$scope', '$uibModalInstance', 'pet',
    function($http, $scope, $uibModalInstance, pet) {
        $scope.pet = pet;

        $scope.ok = function (isValid) {
            $uibModalInstance.close({ pet: $scope.pet, isValid: isValid, file: $scope.imageFile});
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

modal.controller('editPostingModalController', ['$http', '$scope', '$uibModalInstance', 'posting',
    function($http, $scope, $uibModalInstance, posting) {
        $scope.posting = posting;

        $scope.ok = function (isValid) {
            $uibModalInstance.close({ posting: $scope.posting, isValid: isValid, file: $scope.imageFile});
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);

modal.controller('userReviewModalController', ['$http', '$scope', '$uibModalInstance',
    function($http, $scope, $uibModalInstance) {
        $scope.submitStar = function(rating){
            // Set rating to the rating level user selected
            $scope.rating = rating;
            // Note: Rating = Star Index
            var starIndex = rating;
            for (var i = 1; i <= starIndex; i++) {
                $('#star' + i).html('&#9733;');
            }
            for (var i = starIndex + 1; i <= 5; i++) {
                $('#star' + i).html('&#9734;');
            }
        };

        $scope.ok = function () {
            $uibModalInstance.close({ rating: $scope.rating, comment: $scope.reviewComment });
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]);