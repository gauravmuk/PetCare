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