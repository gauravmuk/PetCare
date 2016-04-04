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

// Test data

// Pet data
var mochaTestPet = {
    name: 'Mocha Max',
    user: 2,
    type: 'Dog',
    breed: 'Labrador Retriever',
    gender: 'Male',
    age: 2,
    description: 'Max is a Labrador Retriever.',
    rating: 3,
    photo: 'http://elelur.com/data_images/dog-breeds/labrador-retriever/labrador-retriever-06.jpg'
}

// Pet sitter data
var mochaTestSitterPosting = {
    user: 2,
    title: 'Mocha sitter posting',
    types: 'Dogs, Cats, Birds',
    duration: 'March 3rd to April 1st',
    location: 'Downtown, Ottawa, ON',
    price: '200 - 250',
    experience: '2 years',
    supplies: 'Toys, Kennel, Clothes',
    number_of_pets: 100,
    description: 'I will look after your pets for $25 per hour. Please contact me for more information',
    thumbnail: '/images/default-profile-pic.png',
    status: 'open'
}

// Pet posting data
var mochaTestPetPosting = {
    user        : 2,
    pet         : 3,
    title       : 'Mocha Max needs a pet sitter',
    duration    : '2 days',
    location    : 'Toronto',
    price       : '$20/hr',
    supplies    : 'None',
    additional_info: 'N/A',
    description: 'Looking for someone to take care of my cat while I am out of the country.',
    thumbnail: 'images/cat2.jpg',
    status: 'closed'
}

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

    describe('Retrieve pet data for a specified pet', function() {

        it('should respond with 200', function(done) {
            http
            .get('http://localhost:8989/api/pets/1', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            }); 
        });

    });

    describe('Retrieve pet posting data for every posting', function() {

        it('should respond with 200', function(done) {
            http
            .get('http://localhost:8989/api/petpostings', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
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
        // Remove test data we added in this test suite from the database
        app.removeMochaTestUser(mochaTestUser.username);
        app.removeMochaPet(mochaTestPet.name);
        app.removePosting('sitterPosting', mochaTestSitterPosting.title);
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

    describe('Create a new pet', function() {
            it('should create new pet and return pet information', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/pets',
                    form:    {data: mochaTestPet}
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);

                    // Assert the response data and status code
                    assert.equal(obj.name, mochaTestPet.name);
                    assert.equal(obj.type, mochaTestPet.type);
                    assert.equal(obj.breed, mochaTestPet.breed);
                    assert.equal(response.statusCode, 201);

                    done();

                });

        });
    });

    describe('Create a new sitter posting', function() {
            it('should create new sitter posting and return posting information', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/sitterpostings',
                    form:    {data: mochaTestSitterPosting}
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);

                    // Assert the response data and status code
                    assert.equal(obj.title, mochaTestSitterPosting.title);
                    assert.equal(obj.duration, mochaTestSitterPosting.duration);
                    assert.equal(obj.price, mochaTestSitterPosting.price);
                    assert.equal(response.statusCode, 201);

                    done();

                });

        });
    });

});

// All the test cases that make http DELETE requests to the server are written in this suite
describe('Delete Request Test Suite:   ', function() {
    
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
                form:    {data: mochaTestPetPosting}
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

