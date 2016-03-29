/* 
How to Install Mocha
	sudo npm install mocha -g 

How to run tests
	cd to petcare/test directory
	mocha test.js
*/

var http = require('http');
var assert = require('assert');
var app = require('../server');

// `describe()` creates a suite of test cases
describe('GET Request Test Suit:   ', function() {
    
	/*`before()` and `after()` are the functions you can
	use to run a code before starting and after finishing
	all testcases in your suite*/

    // The function passed to before() is called before running the test cases.
    before(function() {
    	// startServer() defined in server.js
    	app.startServer(8989);
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
    	// closeServer() defined in server.js
    	// app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('GET /api/users/:id', function() {

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
