app.factory('authService', ['$q', '$timeout', '$http', '$cookies',function($q, $timeout, $http, $cookies) {
	var user = null;
	var userData = {};

	return({
		isLoggedIn: isLoggedIn,
		login: login,
		logout: logout,
		register: register,
		getUserStatus: getUserStatus,
		getUserData: getUserData,
		setUserData: setUserData
	});

	function isLoggedIn() {
		if (user || $cookies.get('userID') != undefined) {
			return true;
		}
		else {
			return false;
		}
	}

	function getUserData() {
		userData = {
			userID: $cookies.get('userID'),
			userName: $cookies.get('userName'),
			userRole: $cookies.get('userRole')
		}
		return userData;
	};

	function setUserData(newName) {
		$cookies.put('userName', newName);
	};

	function register(username, password, name) {
		var deferred = $q.defer();

		userData = {
			username: 	username, 
			password: 	password,
			name: 		name
		}

		$http.post('/api/register', userData)
			.success(function(data) {
				userData = data;
				$cookies.put('userID', data.id);
				$cookies.put('userName', data.name);
				$cookies.put('userRole', data.role);
				user = true;
				deferred.resolve();
			})
			.error(function(data) {
				user = false;
				deferred.reject();
		});
		return deferred.promise;
	}

	function login(username, password) {
		var deferred = $q.defer();

		userData = {
			username: 	username, 
			password: 	password
		}
		
		$http.post('/api/login', userData)
		.success(function(data) {
			userData = data;
			$cookies.put('userID', data.id);
			$cookies.put('userName', data.name);
			$cookies.put('userRole', data.role);
			user = true;
			deferred.resolve(data);
		})
		.error(function(data) {
			user = false;
			deferred.reject(data);
		});

		return deferred.promise;
	}

	function getUserStatus() {
		$http.get('/api/status')
		  	// handle success
		  	.success(function (data) {
		      	user = data.logged_in;
		      	if (data.logged_in && $cookies.get('userID') == undefined) {
		      		$cookies.put('userID', data.user.id);
					$cookies.put('userName', data.user.name);
					$cookies.put('userRole', data.user.role);
		      	}
		  	})
		  // handle error
		  	.error(function (data) {
		    	user = false;
	  	});
	}

	function logout() {
		var deferred = $q.defer();

		$http.get('/api/logout')
		.success(function(data) {
			userData = {};
			$cookies.remove('userID');
			$cookies.remove('userName');
			$cookies.remove('userRole');
			user = false;
			deferred.resolve();
		})
		.error(function(data) {
			user = false;
			deferred.reject();
			
		});
		return deferred.promise;
	}
}]);