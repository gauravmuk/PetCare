var express = require("express");
var router 	= express.Router();
var Application 	= require.main.require('./server/models/Application');
var Authentication  = require.main.require('./server/models/Authentication');
var Pet 			= require.main.require('./server/models/Pet');
var Sitter_Posting	= require.main.require('./server/models/Sitter_Posting');
var User			= require.main.require('./server/models/User');
var Review			= require.main.require('./server/models/Review');

router.put('/:id', function (req, res) {
	if (isNumber(req.params.id)) {

		Sitter_Posting.findOne({_id: req.params.id}, function (err, sitterposting) {
            sitterposting.title = req.body.data.title;
            sitterposting.duration = req.body.data.duration;
            sitterposting.location = req.body.data.location;
            sitterposting.price = req.body.data.price;
            sitterposting.description = req.body.data.description;

		    sitterposting.save(function (err) {
		        if(err) {
		        }
    			res.status(200).send({_id : sitterposting._id, title : sitterposting.title, duration : sitterposting.duration,
    				price : sitterposting.price, status : sitterposting.status});
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Close a sitter posting
router.put('/:id/:status', function (req, res) {

	if (isNumber(req.params.id) && isString(req.params.status)) {

		Sitter_Posting.findOne({_id: req.params.id}, function (err, sitterposting) {

			if (req.params.status == 'close') {
	            sitterposting.status = 'closed';
	        	console.log('closed posting');
	        } else if (req.params.status == 'open') {
	            sitterposting.status = 'open';
	       		console.log('opened posting');
	        }

		    sitterposting.save(function (err) {
		        if(err) {
		        }
				res.setHeader('Location', '/petsitter_posts/' + sitterposting._id);
    			res.status(200).send({_id : sitterposting._id, title : sitterposting.title, duration : sitterposting.duration,
    				price : sitterposting.price, status : sitterposting.status});
		    });

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

// Search sitter postings
router.get("/:pet/:location/:max_price/:userId", function(req, res){
	var sitterPosting = [];
	var application = [];
	var users = [];
	var pets = [];

	var pet = req.params.pet;
	var location = req.params.location;
	var max_price = req.params.max_price;
	var userId = req.params.userId;

	console.log(pet +" "+location+" "+ max_price+" " +userId);

	Sitter_Posting.find({}).populate('user').exec(function(err, sitterPosting) {
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
					for (var i = 0; i < sitterPosting.length; i++) {
						if (sitterPosting[i]['status'] === "closed" || sitterPosting[i]['user']['_id'] == userId)
							continue;

						var rank = 0;

						if (pet === "none") {
							rank += 1;
						} else if (sitterPosting[i]['types'].match(regex_pet)) {
							rank += 2;
						} else if (pet === "user_data" && userId != 'undefined') {
							for (var k = 0; k < pets.length; k++) {
								if (pets[k]['user'] == userId) {

									regex_pet = new RegExp(".*" + pets[k]['type'] + ".*", "i");
									if (sitterPosting[i]['types'].match(regex_pet)) {
										rank += 2;
										break;
									}
								}
							}
						}

						if (location === "none") {
							rank += 1;
						} else if (sitterPosting[i]['location'].match(regex_location)) {
							rank += 2;
			 			} else if (userId != 'undefined') {
			 				for (var k = 0; k < users.length; k++) {
			 					if (users[k]['_id'] == userId && users[k]['location'] == sitterPosting[i]['location']) {
			 						rank += 2;
			 						break;
			 					}
			 				}
			 			}

						var lower_price = "" + sitterPosting[i]['price'].match(/([^ ]+)/, "")[1];

						if (max_price === "none") {
							rank += 1;
						} else if (isNaN(max_price) || isNaN(lower_price)
							|| Number(max_price) < Number(lower_price)) {
							continue;
						} else {
							rank += 2;
						}

						var applied = false;
						for (var j = 0; j < application.length; j++) {
							if (!application[j]['isPetPost'] && application[j]['sitter_posting'] == sitterPosting[i]['_id']
								&& application[j]['from'] == userId) {
								applied = true;
								break;
							}
						}

						data.push({
							rank: rank,
							posting_id: sitterPosting[i]['_id'],
							user_id: sitterPosting[i]['user']['_id'],
							title: sitterPosting[i]['title'],
							types: sitterPosting[i]['types'],
							duration: sitterPosting[i]['duration'],
							location: sitterPosting[i]['location'],
							price: sitterPosting[i]['price'],
							experience: sitterPosting[i]['experience'],
							description: sitterPosting[i]['description'],
							thumbnail: sitterPosting[i]['thumbnail'],
							rating: sitterPosting[i]['user']['rating'],
							applied: applied
						});
					}
					res.json(data);

				});
			});
		});
	});
});

// Delete a given sitter posting from the database
router.delete("/:id", function(req, res){

	if (isNumber(req.params.id)) {

		// Get params from the request
		var postID = req.params.id;
		//console.log("delete sitter posting " + postID);
		// remove a sitter posting with a given ID from the datbase
		Sitter_Posting.remove({ _id:postID }, function(err, result){
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

// Return all sitter postings
router.get("/", function(req, res){
	var sitterposting = [];
	Sitter_Posting.find({}, function(err, sitterposting) {
		if (err) {
			throw err;
		}
		res.json(sitterposting)
	});
});

router.get("/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var sitterposting = [];
		Sitter_Posting.findById(req.params.id).populate('user').exec(function(err, sitterposting) {
			if (err) {
				throw err;
			}
			res.json(sitterposting)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

router.post("/", function(req, res){
	var newPost = new Sitter_Posting({
		user: req.body.data.user,
		types: req.body.data.types,
		title: req.body.data.title,
		duration: req.body.data.duration,
		location: req.body.data.location,
		price: req.body.data.price,
		experience: req.body.data.experience,
		supplies: req.body.data.supplies,
		number_of_pets: req.body.data.number_of_pets,
		description: req.body.data.description,
		thumbnail: req.body.data.thumbnail,	// TODO: Get user image
		status: 'open'
	});

	newPost.save(function(err) {
		res.setHeader('Location', '/petsitter_posts/' + newPost._id);
    	res.status(201).send({_id : newPost._id, title : newPost.title, duration : newPost.duration,
    	price : newPost.price, status : newPost.status});
	});

});

// Given a post ID, return the avg rating of the person who made the post(User/Sitter)
router.get("/:id/rating", function(req, res){
	console.log('GET /api/sitterpostings/:id/rating');

	var postID = req.params.id;
	if (isNumber(postID)){
		// Query post from the database and get the ID of the user who made the post
		Sitter_Posting.findOne({_id : postID}, function(err, post){
			if(err){
				console.log("error");
			}
			else{
				// If found post successfully
				// Get the ID of the user who made the post from this post we found
				var userID = post.user;
				// Query that user and return his/her average rating
				User.findOne({_id: userID}, function(err, user){
					var avgRating = user.rating;
					// Send back a response or end response
					console.log('Avg rating of the user= ' + avgRating);
					res.json({avgRating: avgRating});
				});
			}
		});
	}
	else{
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update Sitter review table, calculate new average rating for person who made the post(User/Sitter) and update
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
			var reviewRating 	= req.body.data.rating;
			var reviewComment 	= req.body.data.comment;
			var postID 			= req.params.id;

			// Get user Id who made the post
			if (isNumber(postID)){
				Sitter_Posting.findOne({_id : postID}, function(err, post){
					if(err){
						console.log("error");
					}
					// If found post successfully 
					else{
						// Get user Id who made the post from this post we found
						var toUser = post.user;

						// Save Review information in the database 
						Review.create({
						to: toUser,
						from: fromUser,
						rating: reviewRating,
						comment: reviewComment

						}, function(err, review){
						if(err){
							console.log("Review.create(): error\n"+ err);
						}
						else{
							// Successfully added a new review to the database
							// Now calculate average rating for the 'to' user
							Review.find({to: toUser}, function(err, reviews){
							if(err){
								"Review.find(): error\n"+ err
							}
							else{
								// Successfully found all the reviews for the given user
								// Now calulate the new average rating value for the user
								var num = reviews.length;
								var sum = 0;
								for (var i=0; i<num; i++){
									sum = sum + reviews[i].rating;
								}

								// Round the average rating to int
								var newAvgRating = Math.round(sum/num)
								console.log("Average rating for user "+ toUser + " = " + newAvgRating);
								console.log("From user "+ fromUser);
							
								// Update new average rating on the user schema
								User.update({_id: toUser}, {$set: {rating:newAvgRating}}, function(err, updatedUser){
									if(err){
										console.log(err);
									}
									else{
										console.log(updatedUser);
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

function isNumber(value) {
    return /^\d+$/.test(value);
};

function isString(value) {
    return /^\w+$/.test(value);
};
module.exports = router