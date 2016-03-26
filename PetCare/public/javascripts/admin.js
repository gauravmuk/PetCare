var admin = angular.module('admin', []);

admin.controller('adminController', ['$rootScope', '$anchorScroll', '$location', '$http', '$scope', 'shareDataService', 
    function($rootScope, $anchorScroll, $location, $http, $scope, shareDataService) {
    $scope.users = [];
    $scope.petPostings = [];
    $scope.sitterPostings = [];
    $scope.reports = [];

    $scope.num_users = 0;
    $scope.num_petPostings = 0;
    $scope.num_sitterPostings = 0;
    $scope.num_reports = 0;
    $scope.num_postings = 0;

    // TODO: Format created_at dates

    $http.get('/api/users').success(function(data){
        $scope.users = data;
        $scope.num_users = Object.keys($scope.users).length;
    });

    $http.get('/api/petpostings').success(function(data){
        $scope.petPostings = data;
        $scope.num_petPostings = Object.keys($scope.petPostings).length;
        $scope.num_postings += $scope.num_petPostings;
    });

    $http.get('/api/sitterpostings').success(function(data){
        $scope.sitterPostings = data;
        $scope.num_sitterPostings = Object.keys($scope.sitterPostings).length;
        $scope.num_postings += $scope.num_sitterPostings;
    });

    $http.get('/api/reports').success(function(data){
        $scope.reports = data;
        $scope.num_reports = Object.keys($scope.reports).length;
    });

    $scope.scroll = function(anchor) {
        $location.hash(anchor);
        $anchorScroll();
    };

    // Admin Actions

    $scope.setUserId = function(userID){
        shareDataService.setData(userID);
    }

    $scope.setPostingId = function(postingType, postingID){
        // Pass arguments as one object for easier handling
        var obj = {
            postingType : postingType,
            postingID : postingID
        }
        shareDataService.setData(obj);
    }
}]);

admin.controller('adminModalController', ['$rootScope', '$http', '$scope', 'shareDataService', 
	function($rootScope, $http, $scope, shareDataService){

	// Get user Id from shared data
	// Make http request to ban the user
    $scope.ConfirmBan = function(){
    	var userID = shareDataService.getData();
    	console.log("app.js: Ban user " + userID);

    	// Creare object to be sent through the put request 
    	var dataObj = {
    		id:userID
    	}
    	
    	// Make an http put request since Angular doesn't provide update
    	$http.put('/users/'+ userID + '/ban', {data:dataObj})
			.success(function(data, status, headers, config) {
				// If update request was successful, update the view (i.e change from 'Ban' to 'Banned')
    			$('#ban-btn-'+userID).html('Banned');
			}).error(function(data, status, headers, config) {
    			console.log("error");
			});
    }

	// Make http request to delete the user
    $scope.ConfirmDelete = function(){
    	var postID   = shareDataService.getData().postingID;
    	var postType = shareDataService.getData().postingType;

    	console.log("app.js: Delete post " + postID + " from " + postType);

    	// TO-DO: Make an http delete request 
    }

}]);