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

// All the test cases that make http POSt requests to the server are written in this suite
describe('Post Request Test Suite:   ', function() {
    
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

            // Create user data object to be posted with the POST request
            mochaTestUser = {
                username:   'AnnaSmith1988@gmail.com', 
                password:   '1234',
                name:       'Anna Smith'
            }

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


