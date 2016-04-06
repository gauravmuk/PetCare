/*
Installing packages
    cd in to the PetCare directory
    npm install 

How to Install Mocha
	sudo npm install mocha -g 

How to run tests
    Close the PetCare application if it is running in a different terminal
    start the mongo daemon by typing 'mongod --dbpath ./mongodb_data' if you havent done so already
    open a new terminal
    cd in to PetCare/test directory
	mocha test.js

NOTE: 
    You cannot run the PetCare application and the Mocha test cases at the same time 
    because mongoDB by default is trying to connect to the same port. 
*/

var http = require('http');
var request = require('request');
var assert = require('assert');
var app = require('../server');


// Test data

// Message data
var mochaTestMsg = {
    to: 2,
    from: -1,
    message: 'Mocha: I am good today. Thanks!',
    token: 1,
}

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
    price       : '20',
    supplies    : 'None',
    additional_info: 'N/A',
    description: 'Looking for someone to take care of my cat while I am out of the country.',
    thumbnail: 'images/cat2.jpg',
    status: 'closed'
}

// Forum post data
var mochaTestForumPost = {
    user: 2,
    type: 'message',
    message: 'Mocha: I am looking for a dog park in Toronto.',
    image: '',
    likes: 4
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

    // Make a GET request to /api/pets/1 and check if we get a valid response/ OK code
    describe('Retrieve pet data for a specified pet', function() {

        it('should respond with 200', function(done) {
            http
            .get('http://localhost:8989/api/pets/1', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
                    // Success condition is states code 200
                    assert.equal(response.statusCode, 200);
                    done();
                });
            }); 
        });

    });

    // Make a GET request to /api/petpostings and check if we get a valid response/ OK code
    describe('Retrieve pet posting data for every posting', function() {

        it('should respond with 200', function(done) {
            http
            .get('http://localhost:8989/api/petpostings', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
                    // Success condition is states code 200
                    assert.equal(response.statusCode, 200);
                    done();
                });
            }); 
        });
    });

    // Make a GET request to /api/messages/1/ with an invalid token and check if we get 401 Unauthorized code
    describe('Access to another user\'s messages', function() {

        it('should respond with 401, unauthorized', function(done) {
            http
            .get('http://localhost:8989/api/messages/1/wrong_token', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
                    // Success condition is states code 401
                    assert.equal(response.statusCode, 401);
                    done();
                });
            }); 
        });
    });

    // Make a GET request to /api/applications/1/ with an invalid token and check if we get 401 Unauthorized code
    describe('Access to another user\'s applications', function() {

        it('should respond with 401, unauthorized', function(done) {
            http
            .get('http://localhost:8989/api/applications/1/wrong_token', function(response){
                
                response.on('data', function(data) {
                });

                response.on('end', function() {
                    // Success condition is states code 401
                    assert.equal(response.statusCode, 401);
                    done();
                });
            }); 
        });
    });
    
});

// All the test cases that make http POST requests to the server are written in this suite
describe('POST Request Test Suite:   ', function() {
    
    // Create user data object to be posted with the POST request
    var mochaTestUser = {
        username:   'AnnaSmith1988@gmail.com', 
        password:   '1234',
        name:       'Anna Smith'
    }

    // The function passed to before() is called before running the test cases.
    before(function() {
        app.startServer(8989);

        // set token to user 1
        var Authentication  = require('../server/models/Authentication');
        var authentication = new Authentication({
            user: -1,
            token: 1,
        });
        authentication.save();
    });

    // The function passed to after() is called after running the test cases.
    after(function() {
        // Remove test data we added in this test suite from the database
        app.removeMochaTestUser(mochaTestUser.username);
        app.removeMochaPet(mochaTestPet.name);
        app.removePosting('sitterPosting', mochaTestSitterPosting.title);
        app.removeMochaMessage(mochaTestMsg.message);
        app.removeMochaToken(1);
        app.closeServer();
    });

    // `describe()` creates a suite of test cases
    describe('Make an http POST to /auth/register', function() {
        it('Should create new user', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/auth/register',
                    form:    mochaTestUser
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);
                    // Assert the user role, user name and status code
                    assert.equal(obj.role, 'regular');
                    assert.equal(obj.name, mochaTestUser.name);
                    assert.notEqual(obj.token, null);
                    assert.equal(response.statusCode, 200);

                    // logout
                    request.get(
                        {
                            url:     'http://localhost:8989/auth/logout',
                            form:    mochaTestUser
                        }, 
                        function(error, response, body){
                            assert.equal(response.statusCode, 200);
                            done();
                        });
                });
        });
    });

    // Test login to the web application as a test user
    describe('Make an http POST to /api/login', function() {
            it('Should login the user', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/auth/login',
                    form:    mochaTestUser
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);
                    // Assert the user role, user name and status code
                    assert.equal(obj.name, mochaTestUser.name);
                    assert.notEqual(obj.token, null);
                    assert.equal(response.statusCode, 200);
                    done();  
                });

        }); 
    });

    // Test logout from the web application
    describe('Make an http GET to /api/logout', function() {
            it('Should logout the user', function(done) {

            request.get(
                {
                    url:     'http://localhost:8989/auth/logout',
                    form:    mochaTestUser
                }, 
                function(error, response, body){
                    assert.equal(response.statusCode, 200);
                    done();  
                });

        }); 
    });

    // Make an http POST request to /api/pets to add a new pet
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

    // Make an http POST request to /api/sitterpostings to add a new sitter posting 
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

    // Make an http POST request to /api/messages to send a message to another user 
    describe('Send a message', function() {
        it('should create a new message', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/messages',
                    form:    mochaTestMsg
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);

                    // Assert the response data and status code
                    assert.equal(obj.to, mochaTestMsg.to);
                    assert.equal(obj.from, mochaTestMsg.from);
                    assert.equal(obj.message, mochaTestMsg.message);
                    assert.equal(obj.read, false);
                    assert.equal(response.statusCode, 201);

                    done();
                });        
        });
    });

});

// All the test cases that make http DELETE requests to the server are written in this suite
describe('DELETE Request Test Suite:   ', function() {
    
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
describe('PUT Request Test Suite:   ', function() {
    
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
        app.removePosting('sitterPosting', mochaTestSitterPosting.title);
        app.removeForumPost(mochaTestForumPost.message);
        app.closeServer();
    });

    // `describe()` creates a suite of test cases
    // change user banned field to ban a user from the system
    describe('Ban a user', function() {
        it('Should create new user and ban that user', function(done) {

            // First register to the system. This will automatically login the test user
            request.post(
                {
                    url:     'http://localhost:8989/auth/register',
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

                        // logout from the system
                        request.get(
                            {
                                url:     'http://localhost:8989/auth/logout',
                                form:    mochaTestUser
                            }, 
                            function(error, response, body){
                                assert.equal(response.statusCode, 200);
                                done();
                            });
                    });
                });

        });
    });

    // Make a PUT request to update the likes field
    describe('Like a forum post', function() {
        it('should increase the likes on a forum post by 1', function(done) {

            // create the forum post
            request.post(
                {
                    url:     'http://localhost:8989/api/forumposts',
                    form:    {data: mochaTestForumPost}
                }, 
                function(error, response, body){
                    var obj = JSON.parse(body);
                    // Get newly created post Id
                    var forumID = obj._id;
                    // Assert the data and status code
                    assert.equal(obj.message, mochaTestForumPost.message);
                    assert.equal(obj.likes, mochaTestForumPost.likes);
                    assert.equal(response.statusCode, 201);

                    // Make a PUT request to 'like' this forum post
                    request({
                        uri: 'http://localhost:8989/api/forumposts/' + forumID + '/like',
                        method: "PUT"
                    },
                    function(error, response, body) {
                        
                        var obj = JSON.parse(body);
                        // Assert likes
                        assert.equal(obj.likes, mochaTestForumPost.likes + 1);
                        // Status code 200 == OK
                        assert.equal(response.statusCode, 200);    
                        done();
                    });
                });

        });
    });

    // Make a http PUT request to update the status filed of the post
    describe('Close a sitter posting', function() {
        it('should set a sitter posting status to closed', function(done) {

            request.post(
                {
                    url:     'http://localhost:8989/api/sitterpostings',
                    form:    {data: mochaTestSitterPosting}
                }, 
                function(error, response, body){
                    // Convert the body string into a JavaScript object
                    var obj = JSON.parse(body);
                    var postingID = obj._id;

                    // Assert the response data and status code
                    assert.equal(obj.status, mochaTestSitterPosting.status);
                    assert.equal(response.statusCode, 201);

                    // Make a PUT request to close this posting
                    request({
                        uri: 'http://localhost:8989/api/sitterpostings/' + postingID + '/close',
                        method: "PUT"
                    },
                    function(error, response, body) {
                        
                        var obj = JSON.parse(body);
                        // Assert status
                        assert.equal(obj.status, 'closed');
                        // Status code 200 == OK
                        assert.equal(response.statusCode, 200);    
                        done();
                    });
                });

        });
    });

});

// Test cases testing the isInt() function
describe('Valid Integer Test Suite', function() {

    // Test valid user input from the user
    // Success condition is 'true'
    describe('Valid integer tests', function() {

        it('should return true if value is an integer', function(done) {
            assert.equal(true, app.isInt(0));
            assert.equal(true, app.isInt('1'));
            assert.equal(true, app.isInt('100'));
            done();
        });
    });

    // Test invalid user input from the user (i.e: doubles, chars, strings instead of intiger values)
    // Success condition is 'false'
    describe('Invalid integer tests', function() {

        it('should return true if value is an integer', function(done) {
            assert.equal(false, app.isInt('10.2'));
            assert.equal(false, app.isInt('123abc'));
            assert.equal(false, app.isInt('hello world'));
            done();
        });
    });

});
