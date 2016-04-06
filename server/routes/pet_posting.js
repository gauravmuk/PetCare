var express = require("express");
var router 	= express.Router();
var Application 	= require('../../server/models/Application');
var Authentication  = require('../../server/models/Authentication');
var Pet 			= require('../../server/models/Pet');
var Pet_Posting		= require('../../server/models/Pet_Posting');
var User			= require('../../server/models/User');
var Pet_Review		= require('../../server/models/Pet_Review');

// Update Pet review table, calculate new average rating for the pet on the post and update rating
router.post("/:id/reviews", function(req, res){
	// check userId matches with token
	Authentication.findOne({user: req.body.data.from}, function(err, authen){
		if(err) {
			throw err;
		}
		if (authen == null || authen.token != req.body.data.token) {
			res.status(401).send({ error: "Token does not match." });
		} else {

			// Get Review information from the request body
			var fromUser 		= req.body.data.from;
			var reviewRating 	= req.body.data.rating || 0;
			var reviewComment 	= req.body.data.comment;
			var postID 			= req.params.id;

			// Get user Id who made the post
			if (isNumber(postID)){
				Pet_Posting.findOne({ _id : postID }, function(err, post){
					if (err){
						throw err;
					}
					// If found post successfully 
					else{
						// Get user pet id which we want to make the review to
						var toPet = post.pet;
						// Save Review information in the database 
						Pet_Review.create({
						to: toPet,
						from: fromUser,
						rating: reviewRating,
						comment: reviewComment

						}, function(err, review){
						if (err){
							throw err;
						}
						else{
							// Successfully added a new review to the database
							// Now calculate average rating for the 'to' user
							Pet_Review.find({ to: toPet }, function(err, reviews){
							if(err){
								"Review.find(): error\n"+ err
							}
							else {
								// Successfully found all the reviews for the given user
								// Now calulate the new average rating value for the user
								var num = reviews.length;
								var sum = 0;
								var reviewIds = [];

								for (var i = 0; i < num; i++){
									sum = sum + reviews[i].rating;
									reviewIds.push(reviews[i]._id);
								};

								// Round the average rating to int
								var newAvgRating = Math.round(sum/num);

								// Update new average rating on the user schema
								Pet.update({ _id: toPet }, { $set: { rating: newAvgRating, reviews: reviewIds }}, function(err, updatedPet) {
									if (err){
										throw err;
									}
									else{
										console.log(updatedPet);
									}
								});
							}
							}); 
						}
						});
					}
				});
			}

			// Send back a response or end response
			res.json({resData: "data"});
		}
	});
});

// Given a post ID, return the avg rating of the pet reffered to by the post
router.get("/:id/rating", function(req, res){
	var postID 			= req.params.id;
	if (isNumber(postID)){
		// Query post from the database and get the ID of pet reffered to by this post
		Pet_Posting.findOne({_id : postID}, function(err, post){
			if(err){
				console.log("error");
			}
			else{
				// If found post successfully
				// Get user Id of the pet
				var PetID = post.pet;
				// Query that pet and return it's average rating
				User.findOne({_id: PetID}, function(err, pet){
					var avgRating = pet.rating;
					// Send back a response or end response
					console.log('Avg rating of the pet = ' + avgRating);
					res.json({avgRating: avgRating});
				});
			}
		});
	}	
	else{
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Returns information about a pet posting with the given id
router.get("/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var petposting = [];
		Pet_Posting.findById(req.params.id).populate('user').exec(function(err, petposting) {
			if (err) {
				throw err;
			}
			res.jsonp(petposting)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Returns all pet postings
router.get("/", function(req, res){
	var petposting = [];
	Pet_Posting.find({}, function(err, petposting) {
		if (err) {
			throw err;
		}
		res.json(petposting)
	});
});


// Delete a given pet posting from the database
router.delete("/:id", function(req, res){

	if (isNumber(req.params.id)) {

		// Get params from the request
		var postID = req.params.id;
		//console.log("delete sitter posting " + postID);
		// remove a pet posting with a given ID from the datbase
		Pet_Posting.remove({ _id:postID }, function(err, result){
			if(err){
				throw err;
			}
			else{
				// On success, log and return response
				//console.log("sitter posting deleted " + result);
				res.json(result);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Creates a new pet posting
router.post("/", function(req, res){

	var newPost = new Pet_Posting({
		user: req.body.data.user,
		title: req.body.data.title,
		duration: req.body.data.duration,
		location: req.body.data.location,
		price: req.body.data.price,
		supplies: req.body.data.supplies,
		additional_info: req.body.data.additional_info,
		description: req.body.data.description,
		thumbnail: req.body.data.thumbnail,	// TODO: Get user image
		pet: req.body.data.pet,
		status: 'open'
	});

	newPost.save(function(err, result) {
		res.setHeader('Location', '/pet_posts/' + newPost._id);
    	res.status(201).send({_id : result._id, title : result.title, duration : result.duration,
    	price : result.price, status : result.status});
	});
});

// Updates information for a pet posting with the given id
router.put('/:id', function (req, res) {

	if (isNumber(req.params.id)) {

		Pet_Posting.findOne({_id: req.params.id}, function (err, petposting) {

            petposting.title = req.body.data.title;
            petposting.duration = req.body.data.duration;
            petposting.location = req.body.data.location;
            petposting.price = req.body.data.price;
            petposting.description = req.body.data.description;


		    petposting.save(function (err) {
		        if(err) {
		        }
    			res.status(200).send({_id : petposting._id, title : petposting.title, duration : petposting.duration,
    				price : petposting.price, status : petposting.status});
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Changes the status of a pet posting
router.put('/api/petpostings/:id/:status', function (req, res) {

	if (isNumber(req.params.id) && isString(req.params.status)) {

		Pet_Posting.findOne({_id: req.params.id}, function (err, petposting) {

			if (req.params.status == 'close') {
	            petposting.status = 'closed';
	        	console.log('closed posting');
	        } else if (req.params.status == 'open') {
	            petposting.status = 'open';
	       		console.log('opened posting');
	        }

		    petposting.save(function (err) {
		        if(err) {
		        }
				res.setHeader('Location', '/pet_posts/' + petposting._id);
    			res.status(200).send({_id : petposting._id, title : petposting.title, duration : petposting.duration,
    				price : petposting.price, status : petposting.status});
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Search pet postings given user queries
router.get("/:pet/:location/:min_price/:userId", function(req, res){
	var petposting = [];
	var application = [];
	var users = [];
	var pets = [];

	var pet = req.params.pet;
	var location = req.params.location;
	var min_price = req.params.min_price;
	var userId = req.params.userId;

	Pet_Posting.find({}).populate('pet').exec(function(err, petposting) {
		if (err) { throw err; }
		Application.find({}, function(err, application) {
			if (err) { throw err; }
			User.find({}, function(err, users){
				if (err) { throw err; }
				Pet.find({}, function(err, pets){
					if (err) { throw err; }

					var regex_pet = new RegExp(".*" + pet + ".*", "i");
					var regex_location = new RegExp(".*" + location + ".*", "i");

					// create JSON object
					var data = [];
					for (var i = 0; i < petposting.length; i++) {
						if (petposting[i]['status'] === "closed" || petposting[i]['user'] == userId)
							continue;

						var rank = 0;

						if (pet === "none") {
							rank += 1;
						} else if (pet === "user_data" && userId != 'undefined') {
							for (var k = 0; k < pets.length; k++) {
								if (pets[k]['user'] == userId && pets[k]['type'] == petposting[i]['pet']['type']) {
									rank += 2;
									break;
								}
							}
						} else if (petposting[i]['pet']['type'].match(regex_pet)) {
							rank += 2;
						}

						if (location === "none") {
							rank += 1;
						} else if (location === "user_data" && userId != 'undefined') {
			 				for (var k = 0; k < users.length; k++) {
			 					if (users[k]['_id'] == userId && users[k]['location'] == petposting[i]['location']) {
			 						rank += 2;
			 						break;
			 					}
			 				}
						} else if (petposting[i]['location'].match(regex_location)) {
							rank += 2;
						}

						if (min_price === "none") {
							rank += 1;
						} else if (isNaN(min_price) || isNaN(petposting[i]['price'])
							|| Number(min_price) > Number(petposting[i]['price'])) {
							continue;
						} else {
							rank += 2;
						}

						var applied = false;
						for (var j = 0; j < application.length; j++) {
							if (application[j]['isPetPost'] && application[j]['pet_posting'] == petposting[i]['_id']
								&& application[j]['from'] == userId) {
								applied = true;
								break;
							}
						}

						data.push({
							rank: rank,
							posting_id: petposting[i]['_id'],
							user_id: petposting[i]['user'],
							pet_id: petposting[i]['pet']['_id'],
							title: petposting[i]['title'],
							duration: petposting[i]['duration'],
							location: petposting[i]['location'],
							price: petposting[i]['price'],
							description: petposting[i]['description'],
							thumbnail: petposting[i]['thumbnail'],
							pet_type: petposting[i]['pet']['type'],
							rating: petposting[i]['pet']['rating'],
							pet_age: petposting[i]['pet']['age'],
							applied: applied
						});
					}
					//console.log(data);
					res.json(data);
				});
			});
		});
	});
});

// Returns true if the value is an integer
function isNumber(value) {
    return /^\d+$/.test(value);
};

// Returns true if the value is a String
function isString(value) {
    return /^\w+$/.test(value);
};

module.exports = router