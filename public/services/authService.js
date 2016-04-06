app.factory('authService', ['$q', '$timeout', '$http', '$cookies', function($q, $timeout, $http, $cookies) {
	var user = null;
	var user_banned = null;
	var userData = {};

	return({
		isLoggedIn: isLoggedIn,
		isBanned: isBanned,
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

	function isBanned() {
		if (user_banned) {
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

		$http.post('/auth/register', userData)
			.success(function(data) {
				if (data.err) {
					user = false;
					deferred.reject(data.err);
				}
				else {
					userData = data;
					$cookies.put('userID', data.id);
					$cookies.put('userName', data.name);
					$cookies.put('userRole', data.role);
					$cookies.put('token', data.token);
					user = true;
					deferred.resolve(data.role);
				}
			})
			.error(function(data) {
				user = false;
				deferred.reject(data);
		});
		return deferred.promise;
	}

	function login(username, password) {
		var deferred = $q.defer();

		userData = {
			username: 	username, 
			password: 	password
		}
		
		$http.post('/auth/login', userData)
		.success(function(data) {
			if (data.err) {
				user = false;
				deferred.reject(data.err);
			}
			else {
				userData = data;
				user_banned = data.banned;
				$cookies.put('userID', data.id);
				$cookies.put('userName', data.name);
				$cookies.put('userRole', data.role);
				$cookies.put('token', data.token);
				user = true;
				deferred.resolve();
			}
		})
		.error(function(data) {
			user = false;

			deferred.reject(data);
		});

		return deferred.promise;
	}

	function getUserStatus() {
		$http.get('/auth/status')
		  	// handle success
		  	.success(function (data) {
		      	user = data.logged_in;
		      	user_banned = data.is_banned;
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

		$http.get('/auth/logout')
		.success(function(data) {
			userData = {};
			$cookies.remove('userID');
			$cookies.remove('userName');
			$cookies.remove('userRole');
			$cookies.remove('token');
			user = false;
			user_banned = false;
			deferred.resolve();
		})
		.error(function(data) {
			user = false;
			user_banned = false;
			deferred.reject();
			
		});
		return deferred.promise;
	}
}]);