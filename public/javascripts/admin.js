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
        console.log("setUserId = " + userID);
        shareDataService.setData(userID);
    }

    $scope.setPostingId = function(postingType, postingID){
        // Pass arguments as one object for easier handling
        var obj = {
            postingType : postingType,
            postingID : postingID
        }
        console.log("setPostingId");
        console.log(obj);
        shareDataService.setData(obj);
    }

    $scope.setReportMessage = function(reportMessage) {
        $('#reportModal .modal-body').html(reportMessage);
    }

}]);

admin.controller('adminModalController', ['$rootScope', '$http', '$scope', 'shareDataService', '$cookies',
	function($rootScope, $http, $scope, shareDataService, $cookies){

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
    	$http.put('/api/users/'+ userID + '/ban', {data:dataObj})
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

        // If type is sitter_posting, make an API call to delete /api/sitterpostings/:id
        if (postType === 'sitter_posting'){
            // Make an http delete request to delete post with a given id
            $http.delete('/api/sitterpostings/'+ postID)
                .success(function(data, status, headers, config) {
                    // If delete request was successful, update the view (i.e hide post)
                    $('#sitter-post-'+postID).hide();
                }).error(function(data, status, headers, config) {
                    console.log("error");
                });
        }
        // If type is pet_posting, make an API call to delete /api/petpostings/:id
        if(postType === 'pet_posting'){
            // Make an http delete request to delete post with a given id
            $http.delete('/api/petpostings/'+ postID)
                .success(function(data, status, headers, config) {
                    // If delete request was successful, update the view (i.e hide post)
                    $('#pet-post-'+postID).hide();
                }).error(function(data, status, headers, config) {
                    console.log("error");
                });
        } 
    }

    // Send a message to a given
    // To: a given user ID
    // From : Admin
    $scope.sendMsg  = function() {
        var to   = shareDataService.getData();
        var from = $cookies.get('userID');

        // Cteate object to be sent through the post request
        var data = $.param({
            from: from,
            to: to,
            message: $scope.msg_content
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        console.log(data);
        $http.post('/api/message', data, config);
        $scope.msg_content = "";
    };

    // Edit the information of the given user
    $scope.editUserInfo = function (isValid) {

        // Check if form information is valid   
        if (isValid) {
            var userID = shareDataService.getData();

            // Create object to be sent through the POST request
            var dataObj = {
                name: $scope.user_name,
                location: $scope.user_location,
                description: $scope.user_description
            };

            // Make PUT request to the /api/users/:id
            $http.put('/api/users/' + userID, {data: dataObj})

                .success(function(data, status, headers, config) {

                }).error(function(data, status, headers, config) {
                    
            });

        }

    };

    // Edit posting information
    $scope.editPostingInfo = function (isValid) {

        // Check if form information is valid   
        if (isValid) {

            var postType = shareDataService.getData().postingType;
            var postID   = shareDataService.getData().postingID;

            // Create object to be sent through the POST request
            var dataObj = {
                title: $scope.posting_title,
                duration: $scope.posting_duration,
                location: $scope.posting_location,
                price: $scope.posting_price,
                description: $scope.posting_description,
            };

            // Make PUT request to the /api/users/:id
            $http.put('/api/' + postType + '/' + postID, {data: dataObj})

                .success(function(data, status, headers, config) {

                }).error(function(data, status, headers, config) {
                    
            });
        }

    }


}]);