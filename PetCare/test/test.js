/*
Installing packages
    cd tp PetCare directory
    npm install 

How to Install Mocha
	sudo npm install mocha -g 

How to run tests
	cd to PetCare/test directory
	mocha test.js

NOTE: 
    You cannot run the PetCare application and the Mocha test cases at the same time 
    because mongoDB by defualt is trying to connect to the same port. 
*/


// var User = require("../user");
// User.collection.drop();

var http = require('http');
var request = require('request');
var assert = require('assert');
var app = require('../server');

// `describe()` creates a suite of test cases
// All the test cases that make http GET requests to the server are written in this suite
describe('GET Request Test Suite:   ', function() {
    
	/*`before()` and `after()` are the functions you can
	use to run a code before starting and after finishing
	all testcases in your suite*/

    // The function passed to before() is called before running the test cases.
    before(function() {
    	app.startServer(8989);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
    	app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('Make an http GET request to /api/users/:id', function() {

  		// `it()` implements a test case
		// The first argument to `it()` is an explanation of the test case
		// The second parameter is the test case function
    	it('Should respond with 200', function(done) {
        	http
        	.get('http://localhost:8989/api/users/1', function(response){
				
				response.on('data', function(data) {
					// Do something with data
				});

				response.on('end', function() {
					// Let's wait until we read the response, and then assert the statusCode
                	assert.equal(response.statusCode, 200);
                	done();
        		});
  			});	
    	});

    });
});

// All the test cases that make http POST requests to the server are written in this suite
describe('Post Request Test Suite:   ', function() {
    
    // Create user data object to be posted with the POST request
    var mochaTestUser = {
        username:   'AnnaSmith1988@gmail.com', 
        password:   '1234',
        name:       'Anna Smith'
    }

    // The function passed to before() is called before running the test cases.
    before(function() {
        app.startServer(8989);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
        // Remove tese user we added in this test suite form the database
        app.removeMochaTestUser(mochaTestUser.username);
        app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('Make an http POST to /api/register', function() {
            it('Should create new user', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/register',
                    form:    mochaTestUser
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);
                    // Assert the user role, user name and status code
                    assert.equal(obj.role, 'regular');
                    assert.equal(obj.name, mochaTestUser.name);
                    assert.equal(response.statusCode, 200);
                    done();  
                });

        });
    });
});

// All the test cases that make http DELETE requests to the server are written in this suite
describe('Delete Request Test Suite:   ', function() {
    
    var petPost = {
        user        : 2,
        pet         : 3,
        title       : 'Max seed a pet sitter',
        duration    : '2 days',
        location    : 'Toronto',
        price       : '$20/hr',
        supplies    : 'None'
    }

    // before() is called before running the test cases.
    before(function() {
        app.startServer(8989);
    });

    // after() is called after running the test cases.
    after(function() {
        app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('Delete post', function() {
        it('Should post and delete pet post', function(done) {

        // Create post by doing an http POST request
        request.post(
            {
                url:     'http://localhost:8989/api/petpostings',
                form:    {data:petPost}
            }, 
            function(error, response, body){
                var obj = JSON.parse(body);
                // Get newly created post Id
                var postID = obj._id;
                // Status code 201 == Created
                assert.equal(response.statusCode, 201);

                // Make an http delete request
                request({
                    uri: 'http://localhost:8989/api/petpostings/' + postID,
                    method: "DELETE"
                },
                function(error, response, body) {
                    console.log(body);
                    var obj = JSON.parse(body);
                    // Assert ok:1
                    assert.equal(obj.ok, 1);
                    // Status code 200 == OK
                    assert.equal(response.statusCode, 200);    
                    done();
                });
            });
        });
    });
});

// All the test cases that make http PUT requests to the server are written in this suite
describe('Post Request Test Suite:   ', function() {
    
    // Create user data object to be posted with the POST request
    var mochaTestUser = {
        username:   'michaeljackson@gmail.com', 
        password:   '1234',
        name:       'Michael Jackson'
    }

    // The function passed to before() is called before running the test cases.
    before(function() {
        app.startServer(8989);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
        // Remove tese user we added in this test suite form the database
        app.removeMochaTestUser(mochaTestUser.username);
        app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('Ban a user', function() {
            it('Should create new user and ban that user', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/register',
                    form:    mochaTestUser
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);
                    // Assert the user role, user name and status code
                    assert.equal(obj.role, 'regular');
                    assert.equal(obj.name, mochaTestUser.name);
                    assert.equal(response.statusCode, 200);

                    var userID = obj.id;

                    // Now do a PUT request to ban this user
                    request({
                        uri: 'http://localhost:8989/api/users/' + userID + '/ban',
                        method: "PUT"
                    },
                    function(error, response, body) {
                        
                        var obj = JSON.parse(body);
                        // Assert ok:1
                        assert.equal(obj.ok, 1);
                        // Assert nModified:1
                        assert.equal(obj.nModified, 1);
                        // Status code 200 == OK
                        assert.equal(response.statusCode, 200);    
                        done();
                    });
                });

        });
    });
});

