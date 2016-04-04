// Service to share data between adminController and adminModalController in admin page
app.service('shareDataService', function() {
 	var data;

 	// Setter function that store data	
 	var setData = function(data) {
    	this.data = data;
  	};

  	// Getter function that return data to the controller
  	var getData = function(){
    	return this.data;
  	};

  	return {
    	setData: setData,
    	getData: getData
  	};

});

app.factory('activeLinkService', function($rootScope) {
    var activeLinkService = {};
    
    activeLinkService.forumActive = '';
    activeLinkService.sitterPostingActive = '';
    activeLinkService.petPostingActive = '';

    activeLinkService.prepForBroadcast = function(path) {

      activeLinkService.forumActive = '';
      activeLinkService.sitterPostingActive = '';
      activeLinkService.petPostingActive = '';

      if (path == '/forum') {
        this.forumActive = 'active';
      } else if (path == '/petsitter_posts') {
        this.sitterPostingActive = 'active';
      } else if (path == '/pet_posts') {
        this.petPostingActive = 'active';
      }

      this.broadcastItem();

    };

    activeLinkService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return activeLinkService;
});