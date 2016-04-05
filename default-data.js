/*
	This script will add default data to the mongoDB database
	Only run this script once
	Running this script multiple times will add duplicate data to the database 

	How to run
		1) cd in to the PetCare directory
		2) if your server if already running, do ctrl + c to stop the server
		3) do 'npm istall' if you haven't done so
		4) in one terminal start the mongoDB daemon by typing 'mongod --dbpath ./mongodb_data'
			NOTE: If the mongoDB daemon is already running, you DO NOT have to run it again 
		5) in the second termianl type 'node default-data.js'
			WAIT: Until you see the 'Completed successfully!' message
				: This might take a few seconds
		6) now you can do 'npm start' and load http://localhost:3000/ in a browser
*/

var mongoose 			= require("mongoose");
var autoIncrement 		= require("mongoose-auto-increment");
var async 				= require('async');

/* Database Setup */
// Connect to a database
// NOTE: Dont forget to run 'mongod' (mongoDB daemon) in a different terminal
var connection = mongoose.connect("mongodb://localhost/testDB");
autoIncrement.initialize(connection);

// Import Database schema
var Application 	= require(__dirname + '/public/models/Application');
var Message 		= require(__dirname + '/public/models/Message');
var Pet 			= require(__dirname + '/public/models/Pet');
var Pet_Posting 	= require(__dirname + '/public/models/Pet_Posting');
var Sitter_Posting	= require(__dirname + '/public/models/Sitter_Posting');
var Report			= require(__dirname + '/public/models/Report');
var Review			= require(__dirname + '/public/models/Review');
var Pet_Review		= require(__dirname + '/public/models/Pet_Review');
var User			= require(__dirname + '/public/models/User');
var ForumPost		= require(__dirname + '/public/models/Forum_Post');

// Drop all collections in the db
User.collection.drop();
User.resetCount(function(err, response) {});
Application.collection.drop();
Application.resetCount(function(err, response) {});
Message.collection.drop();
Message.resetCount(function(err, response) {});
Pet.collection.drop();
Pet.resetCount(function(err, response) {});
Pet_Posting.collection.drop();
Pet_Posting.resetCount(function(err, response) {});
Sitter_Posting.collection.drop();
Sitter_Posting.resetCount(function(err, response) {});
Report.collection.drop();
Report.resetCount(function(err, response) {});
Review.collection.drop();
Review.resetCount(function(err, response) {});
Pet_Review.collection.drop();
Pet_Review.resetCount(function(err, response) {});
ForumPost.collection.drop();
ForumPost.resetCount(function(err, response) {});

// Call functions in a series and at the end call process.exit()
async.series([

    function(callback) {		// Adding the admin user

    	// Admin user
        var user = new User({
        	_id		: 1,
			name	: 'Ben Affleck',
			username: 'admin@gmail.com',
			email	: 'admin@gmail.com',
			rating	: 0,
			banned	: false,
			location: 'Toronto, ON',
			role	: 'admin',
			description: '', 
			photo: '/images/default-profile-pic.png'
		});

		var password = 'admin'

        User.register(user, password, function(err) {
			if (err) {
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding regular user
    	var user = new User({
        	_id		: 2,
			name	: 'Jennifer Lawrence',
			username: 'Jenniffer@gmail.com',
			email	: 'Jenniffer@gmail.com',
			rating	: 4,
			banned	: false,
			location: 'Toronto, ON',
			role	: 'regular',
			description: '', 
			photo: '/images/default-profile-pic.png'
		});

		var password = '12345'

        User.register(user, password, function(err) {
			if (err) {
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding regular user
    	var user = new User({
        	_id		: 3,
			name	: 'Christian Bale',
			username: 'Bale@gmail.com',
			email	: 'Bale@gmail.com',
			rating	: 3,
			banned	: false,
			location: 'Toronto, ON',
			role	: 'regular',
			description: '', 
			photo: '/images/default-profile-pic.png'
		});

		var password = '12345'

        User.register(user, password, function(err) {
			if (err) {
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet to userId=2
    	
    	var pet = new Pet({
        	_id: 1,
			name: 'Max',
			user: 2,
			type: 'Dog',
			breed: 'Labrador Retriever',
			gender: 'Male',
			age: 2,
			description: 'Max is a Labrador Retriever.',
			rating: 3,
			photo: 'http://elelur.com/data_images/dog-breeds/labrador-retriever/labrador-retriever-06.jpg'
		});

        pet.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet to userId=2
    	
    	var pet = new Pet({
        	_id: 2,
			name: 'Chloe',
			user: 2,
			type: 'Dog',
			breed: 'Border Terrier',
			gender: 'Female',
			age: 1,
			description: 'Chloe is my favourite pet.',
			rating: 5,
			photo: 'http://germanhuntingterrier.com/images/dog/border_terrier_03.jpg'
		});

        pet.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});

    },

    function(callback) {		// Adding pet to userId=3
    	
    	var pet = new Pet({
        	_id: 3,
			name: 'Polly',
			user: 3,
			type: 'Bird',
			breed: 'Parrot',
			gender: 'Male',
			age: 4,
			description: 'Polly likes to talk.',
			rating: 4,
			photo: 'http://weknowyourdreamz.com/images/parrot/parrot-08.jpg'
		});

        pet.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});

    },

    function(callback) {		// Adding pet to userId=3
    	
    	var pet = new Pet({
        	_id: 4,
			name: 'Oliver',
			user: 3,
			type: 'Cat',
			breed: 'Siamese',
			gender: 'Male',
			age: 4,
			description: 'This is my favourite pet.',
			rating: 2,
			photo: 'http://www.delightibles.com/wp-content/uploads/2015/07/2015.07.10_delightibles-1.jpg'
		});

        pet.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});

    },

    function(callback) {		// Adding report from userId=3 to userId=2
    	
    	var report = new Report({
			to 		: 2,
			from 	: 3,
			message : 'I would like this report this user'
		});

        report.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

	function(callback) {		// Adding report from userId=2 to userId=3
    	
    	var report = new Report({
			to 		: 3,
			from 	: 2,
			message : 'This is a fake account. Please ban this user'
		});

        report.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Review from userId=3 to userId=2
    	var review = new Review({
    		to 		: 2,
			from 	: 3,
			rating 	: 4,
			comment : 'Im very satisfied with the service. I totally recommend her'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Review from userId=3 to userId=2
    	var review = new Review({
    		to 		: 2,
			from 	: 3,
			rating 	: 2,
			comment : 'Not the best pet sitter out there. But she only charged $10/hr'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    }, 

	function(callback) {		// Review from userId=2 to userId=3
    	var review = new Review({
    		to 		: 3,
			from 	: 2,
			rating 	: 4,
			comment : 'Very good service'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

	function(callback) {		// Review from userId=2 to userId=3
    	var review = new Review({
    		to 		: 3,
			from 	: 2,
			rating 	: 4,
			comment : 'He is a very freindly person and has years of experience. My dogs love him'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },   

    function(callback) {		// Pet Review from userId=3 to petId=1
    	var review = new Pet_Review({
    		to 		: 1,  // petId=1
			from 	: 3,
			rating 	: 5,
			comment : 'Very adorable and playful'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Pet Review from userId=3 to petId=2
    	var review = new Pet_Review({
    		to 		: 2,  // petId=2
			from 	: 3,
			rating 	: 3,
			comment : 'I had no trouble looking after him. Im giving 3 stars'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Pet Review from userId=2 to petId=1
    	var review = new Pet_Review({
    		to 		: 1,  // petId=1
			from 	: 2,
			rating 	: 4,
			comment : 'Has a cheerful, tail-wagging nature. I love him'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Pet Review from userId=2 to petId=2
    	var review = new Pet_Review({
    		to 		: 2,  // petId=2
			from 	: 2,
			rating 	: 4,
			comment : 'A little bit grumpy. But I like him. I rate 4/5'
    	});

    	review.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding forum post to userId=2
    	
    	var forumpost = new ForumPost({
		    user: 2,
			type: 'image',
			message: '',
			image: 'http://bebusinessed.com/wp-content/uploads/2014/03/734899052_13956580111.jpg',
			likes: 12
		});

        forumpost.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding forum post to userId=2
    	
    	var forumpost = new ForumPost({
		    user: 2,
			type: 'message',
			message: 'Check out the pictures of my pets.',
			image: '',
			likes: 6
		});

        forumpost.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding forum post to userId=3
    	
    	var forumpost = new ForumPost({
		    user: 3,
			type: 'message',
			message: 'I am looking for a dog park in Toronto.',
			image: '',
			likes: 4
		});

        forumpost.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding forum post to userId=3
    	
    	var forumpost = new ForumPost({
		    user: 3,
			type: 'image',
			message: '',
			image: 'http://weknowyourdreamz.com/images/parrot/parrot-08.jpg',
			likes: 8
		});

        forumpost.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },









    function(callback) {		// Adding pet posting userId = 2, petId = 1
    	
    	var pet_posting = new Pet_Posting({
    		_id: 1,
		    user: 2,
		    pet: 1,
			title: 'Looking for a kind pet sitter.',
			duration: 'May 15 2016 to May 30 2016',
			location: 'Toronto, ON',
			price: '50',
			supplies: 'Toys, Kennel, Clothes',
			additional_info: 'N/A',
			description: 'Looking for someone to take care of my dog while I am out of the country.',
			thumbnail: 'http://elelur.com/data_images/dog-breeds/labrador-retriever/labrador-retriever-06.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 2, petId = 1
    	
    	var pet_posting = new Pet_Posting({
    		_id: 2,
		    user: 2,
		    pet: 1,
			title: 'Looking for a kind pet sitter.',
			duration: 'Feb 01 2016 to Feb 07 2016',
			location: 'Toronto, ON',
			price: '50',
			supplies: 'Toys, Kennel, Clothes',
			additional_info: 'N/A',
			description: 'Looking for someone to take care of my cat while I am out of the country.',
			thumbnail: 'http://elelur.com/data_images/dog-breeds/labrador-retriever/labrador-retriever-06.jpg',
			status: 'closed'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 2, petId = 1
    	
    	var pet_posting = new Pet_Posting({
    		_id: 3,
		    user: 2,
		    pet: 1,
			title: 'Urgent! Looking for a pet sitter for one day',
			duration: 'Apr 08 2016 to Apr 08 2016',
			location: 'Toronto, ON',
			price: '100',
			supplies: 'Toys, Kennel, Clothes',
			additional_info: 'N/A',
			description: 'I have urgent meeting this Friday in Ottawa. Looking for a pet sitter just for one day from morning to night.',
			thumbnail: 'http://elelur.com/data_images/dog-breeds/labrador-retriever/labrador-retriever-06.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 2, petId = 2
    	
    	var pet_posting = new Pet_Posting({
    		_id: 4,
		    user: 2,
		    pet: 2,
			title: 'Somone who likes a dog',
			duration: 'May 01 2016 to July 30 2016',
			location: 'Ottawa',
			price: '15',
			supplies: 'Toys, Kennel, Clothes',
			additional_info: 'N/A',
			description: 'I have one dog in Ottawa and I am going to another city for this summer. Unfortunately, I can\'t go with her. Looking for someone who likes dog and would like to spend this summer with her.',
			thumbnail: 'http://germanhuntingterrier.com/images/dog/border_terrier_03.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 2, petId = 2
    	
    	var pet_posting = new Pet_Posting({
    		_id: 5,
		    user: 2,
		    pet: 2,
			title: 'Looking for a kind pet sitter.',
			duration: 'Feb 01 2016 to Feb 07 2016',
			location: 'Ottawa',
			price: '65',
			supplies: 'Toys, Kennel, Clothes',
			additional_info: 'N/A',
			description: 'Looking for someone to take care of my dog while I am out of the country.',
			thumbnail: 'http://germanhuntingterrier.com/images/dog/border_terrier_03.jpg',
			status: 'closed'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 3, petId = 3
    	
    	var pet_posting = new Pet_Posting({
    		_id: 6,
		    user: 3,
		    pet: 3,
			title: 'Looking for a bird sitter.',
			duration: 'May 01 2016 to May 07 2016',
			location: 'Toronto',
			price: '40',
			supplies: 'Birdcage, Food',
			additional_info: 'N/A',
			description: 'I have special meeting every month. When you apply, please also let me know whether you want to do this every month.',
			thumbnail: 'http://weknowyourdreamz.com/images/parrot/parrot-08.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 3, petId = 3
    	
    	var pet_posting = new Pet_Posting({
    		_id: 7,
		    user: 3,
		    pet: 3,
			title: 'Looking for a bird sitter.',
			duration: 'Apr 01 2016 to Apr 07 2016',
			location: 'Toronto',
			price: '40',
			supplies: 'Birdcage, Food',
			additional_info: 'N/A',
			description: 'I have special meeting every month. When you apply, please also let me know whether you want to do this every month.',
			thumbnail: 'http://weknowyourdreamz.com/images/parrot/parrot-08.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 3, petId = 3
    	
    	var pet_posting = new Pet_Posting({
    		_id: 8,
		    user: 3,
		    pet: 3,
			title: 'Looking for a kind pet sitter.',
			duration: 'Oct 01 2015 to Oct 07 2015',
			location: 'Calgary',
			price: '40',
			supplies: 'Birdcage, Food',
			additional_info: 'N/A',
			description: 'Looking for someone to take care of my bird while I am out of the country.',
			thumbnail: 'http://weknowyourdreamz.com/images/parrot/parrot-08.jpg',
			status: 'closed'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 3, petId = 4
    	
    	var pet_posting = new Pet_Posting({
    		_id: 9,
		    user: 3,
		    pet: 4,
			title: 'Looking for a kind cat sitter in Vancuber.',
			duration: 'May 27 2016 to May 30 2016',
			location: 'Vancuber',
			price: '75',
			supplies: 'Birdcage, Food',
			additional_info: 'N/A',
			description: 'I will traverl Vancuber with my cat but I want to travel alone for just a few days.',
			thumbnail: 'http://www.delightibles.com/wp-content/uploads/2015/07/2015.07.10_delightibles-1.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding pet posting userId = 3, petId = 4
    	
    	var pet_posting = new Pet_Posting({
    		_id: 10,
		    user: 3,
		    pet: 4,
			title: 'Looking for a kind cat sitter in Calgary.',
			duration: 'Apr 27 2016 to Apr 30 2016',
			location: 'Calgary',
			price: '70',
			supplies: 'Birdcage, Food',
			additional_info: 'N/A',
			description: 'I will traverl Calgary with my cat but I want to travel alone for just a few days.',
			thumbnail: 'http://www.delightibles.com/wp-content/uploads/2015/07/2015.07.10_delightibles-1.jpg',
			status: 'open'
		});

        pet_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 1
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 1,
		    user: 1,
			title: 'I love pets.',
			types: 'Dog, Cat',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Downtown, Toronto, ON',
			price: '20 - 25',
			experience: '2 years',
			supplies: 'Educational toys',
			number_of_pets: 5,
			description: 'Hi everyone. I love pets especially dogs and cats. I would like to take care of your pets. Please contact me for more information.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 1
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 2,
		    user: 1,
			title: 'I love pets.',
			types: 'Dog, Cat',
			duration: 'May 01 2015 to May 30 2015',
			location: 'Downtown, Toronto, ON',
			price: '20 - 25',
			experience: '1 year',
			supplies: 'Educational toys',
			number_of_pets: 5,
			description: 'Hi everyone. I love pets especially dogs and cats. I would like to take care of your pets. Please contact me for more information.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'closed'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 2
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 3,
		    user: 2,
			title: 'Sitter Near Calgary',
			types: 'Dog, Cat, Bird, Rabit, Fish',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Calgary',
			price: '20 - 50',
			experience: '5 years',
			supplies: 'Food, Toys',
			number_of_pets: 10,
			description: 'I have raised many types of pets. This May, my friends and I are going to offer pet sitters. We plan to offer this in any place in Canada.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 2
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 4,
		    user: 2,
			title: 'Sitter Near Toronto',
			types: 'Dog, Cat, Bird, Rabit, Fish',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Toronto',
			price: '20 - 50',
			experience: '5 years',
			supplies: 'Food, Toys',
			number_of_pets: 10,
			description: 'I have raised many types of pets. This May, my friends and I are going to offer pet sitters. We plan to offer this in any place in Canada.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 2
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 5,
		    user: 2,
			title: 'Sitter Near Ottawa',
			types: 'Dog, Cat, Bird, Rabit, Fish',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Ottawa',
			price: '20 - 50',
			experience: '5 years',
			supplies: 'Food, Toys',
			number_of_pets: 10,
			description: 'I have raised many types of pets. This May, my friends and I are going to offer pet sitters. We plan to offer this in any place in Canada.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 2
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 6,
		    user: 2,
			title: 'Sitter Near Vancuber',
			types: 'Dog, Cat, Bird, Rabit, Fish',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Vancuber',
			price: '20 - 50',
			experience: '5 years',
			supplies: 'Food, Toys',
			number_of_pets: 10,
			description: 'I have raised many types of pets. This May, my friends and I are going to offer pet sitters. We plan to offer this in any place in Canada.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 2
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 7,
		    user: 2,
			title: 'Sitter Near Montreal',
			types: 'Dog, Cat, Bird, Rabit, Fish',
			duration: 'May 01 2016 to May 30 2016',
			location: 'Montreal',
			price: '20 - 50',
			experience: '5 years',
			supplies: 'Food, Toys',
			number_of_pets: 10,
			description: 'I have raised many types of pets. This May, my friends and I are going to offer pet sitters. We plan to offer this in any place in Canada.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 3
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 8,
		    user: 3,
			title: 'Donkey Donkey Farm offers pet sitter',
			types: 'Horse, Sheep, Chicken, Rabbit, Donkey',
			duration: 'Apr 01 2016 to Aug 30 2016',
			location: 'Vancuber',
			price: '40 - 60',
			experience: '10 years',
			supplies: 'Food, Toys, Spacious yard',
			number_of_pets: 10,
			description: 'Hello folks. Donkey Donkey Farm would like to take care of your pets. We have very spacious yard so we can accomodate big pets.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 3
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 9,
		    user: 3,
			title: 'Donkey Donkey Farm offers pet sitter',
			types: 'Horse, Sheep, Chicken, Rabbit, Donkey',
			duration: 'Apr 01 2015 to Aug 30 2015',
			location: 'Vancuber',
			price: '30 - 50',
			experience: '10 years',
			supplies: 'Food, Toys, Spacious yard',
			number_of_pets: 9,
			description: 'Hello folks. Donkey Donkey Farm would like to take care of your pets. We have very spacious yard so we can accomodate big pets.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'closed'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding sitter posting userId = 3
    	
    	var sitter_posting = new Sitter_Posting({
    		_id: 10,
		    user: 3,
			title: 'Donkey Donkey Farm in Toronto',
			types: 'Horse, Sheep, Chicken, Rabbit, Donkey',
			duration: 'Oct 01 2016 to Oct 30 2016',
			location: 'Toronto',
			price: '50 - 70',
			experience: '10 years',
			supplies: 'Food, Toys, Spacious yard',
			number_of_pets: 9,
			description: 'Hello folks. Donkey Donkey Farm would like to take care of your pets. We will start new farm in Toronto and offer pet sitters as well.',
			thumbnail: '/images/default-profile-pic.png',
			status: 'open'
		});

        sitter_posting.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding application from userId 1 to userId 2
    	
    	var application = new Application({
			to: 2,
			from: 1,
			isPetPost: true,
			pet_posting: 1,
			pet_posting: 1,
			read: true,
			message: 'Hi. I would like to take care of your dog while you are out the country.',
		});

        application.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding application from userId 1 to userId 3
    	
    	var application = new Application({
			to: 3,
			from: 1,
			isPetPost: false,
			pet_posting: 8,
			pet_posting: 8,
			read: false,
			message: 'Hi. My cousin has a sheep and he asked me to take care of it. I think I found a wonderful place!',
		});

        application.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding application from userId 2 to userId 1
    	
    	var application = new Application({
			to: 1,
			from: 2,
			isPetPost: false,
			pet_posting: 1,
			sitter_posting: 1,
			read: false,
			message: 'Hello pet lover. Can you take care of my dog?',
		});

        application.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding application from userId 2 to userId 3
    	
    	var application = new Application({
			to: 3,
			from: 2,
			isPetPost: true,
			pet_posting: 6,
			sitter_posting: 6,
			read: false,
			message: 'Hi. I can take care of your bird.',
		});

        application.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding message from userId 2 to userId 1
    	
    	var meessage = new Message({
			to: 1,
			from: 2,
			message: 'How are you doing today?',
			read: true,
		});

        meessage.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding message from userId 2 to userId 1
    	
    	var meessage = new Message({
			to: 1,
			from: 2,
			message: 'Thanks for the offer. Is $50 per day okay with you?',
			read: false,
		});

        meessage.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding message from userId 1 to userId 2
    	
    	var meessage = new Message({
			to: 2,
			from: 1,
			message: 'I am good today. Thanks!',
			read: true,
		});

        meessage.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

    function(callback) {		// Adding message from userId 1 to userId 3
    	
    	var meessage = new Message({
			to: 3,
			from: 1,
			message: 'Thank you for joining our website. We hope this site is useful to you.',
			read: false,
		});

        meessage.save(function(err, report) {
			if(err){
				console.log(err);
			}
			callback();
		});
    },

// At the end of the script call process.exit()
], function(err, result){
	if (err){ 
		throw err; 
	}
    console.info('Completed successfully!');  
    process.exit();
});
