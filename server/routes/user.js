var express = require("express");
var router 	= express.Router();
var User	= require('../../server/models/User') 
var Pet 	= require('../../server/models/Pet');
var Pet_Posting 	= require('../../server/models/Pet_Posting');
var Sitter_Posting	= require('../../server/models/Sitter_Posting');
var Review			= require('../../server/models/Review');
var Message			= require('../../server/models/Message');
var Authentication  = require('../../server/models/Authentication');
var Application  	= require('../../server/models/Application');

router.get("/:id", function(req, res){
	var user = [];
	if (isNumber(req.params.id)) {

		User.findById(req.params.id, function(err, user) {
			if (err) {
				throw err;
			}
			res.json(user)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
})

// Return all users
router.get("/", function(req, res){
	var user = [];
	User.find({}, function(err, user) {
		if (err) {
			throw err;
		}
		res.json(user)
	});
});

// Ban a user with the given user id
router.put("/:id/ban", function(req, res){

	if (isNumber(req.params.id)) {

		// var id 	= req.body.data.id;
		var id = req.params.id;
		// console.log("updatedUser");

		// Update the 'banned' field of the user to true
		User.update({_id: id}, {$set: {banned:true}}, function(err, updatedUser){
			if (err) {
				throw err;
			}
			else{
				// On Success return info
				//console.log(updatedUser);
				res.json(updatedUser);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update the role of a user
router.put("/:id/role", function(req, res){

	if (isNumber(req.params.id)) {

		var id = req.params.id;
		var oldRole = req.body.data.oldRole;
		var newRole;

		if (oldRole == 'admin') {
			newRole = 'regular';
		} else {
			newRole = 'admin';
		}

		// Update the role of the user
		User.update({_id: id}, {$set: {role: newRole}}, function(err, updatedUser){
			if (err) {
				throw err;
			}
			else{
				console.log(updatedUser);
				res.json(updatedUser);
			}
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Return the pets for a given user
router.get("/:id/pets", function(req, res){
	if (isNumber(req.params.id)) {
		Pet.find({ user: req.params.id })
		.populate('user')
		.populate({ path: 'reviews', populate:{ path: 'from', model: 'User' }})
		.exec(function(err, pet) {
			if (err) {
				throw err;
			}
			res.json(pet);

		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Return the closed or open posts for a given user
router.get("/:id/posts/:status", function(req, res){
	if (isNumber(req.params.id) && isString(req.params.status)) {
		var posts = [];
		Sitter_Posting.find({ user: req.params.id, status: req.params.status }).populate('user').exec(function(err, sitter_post) {
			if (err) {
				throw err;
			}
			if (sitter_post.length > 0) {
				posts = posts.concat(sitter_post);
			}

			Pet_Posting.find({ user: req.params.id, status: req.params.status })
			.populate({ path: 'pet', populate: { path: 'reviews', model: 'PetReview', populate: { path: 'from', model: 'User'} }})
			.exec(function(err, pet_post) {
				if (err) {
					throw err;
				}

				if (pet_post.length > 0) {
					posts = posts.concat(pet_post);
				}
				res.json(posts);
			});
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

router.get("/:id/reviews", function(req, res){
	if (isNumber(req.params.id)) {
		Review.find({ to: req.params.id }).populate('from').exec(function(err, reviews) {
			if (err) {
				throw err;
			}
			res.json(reviews);
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

// Update user information
router.put('/:id', function (req, res) {

	if (isNumber(req.params.id)) {
		User.findOne({ _id: req.params.id }, function (err, user) {
		    user.name 			= req.body.data.name;
		    user.email 			= req.body.data.email;
		    user.location 		= req.body.data.location;
		    user.description 	= req.body.data.description;
		    if (req.body.data.photo) {
		    	user.photo = req.body.data.photo;
		    }
		    user.save(function (err, user) {
		        if (err) {
		        	throw err;
		        }
    			res.status(200);
    			res.json(user);
		    });

		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
}); 

// Get the number of new messages and applications
router.get("/:userId/:token/news", function(req, res){
	if (req.params.userId != 'undefined' && isNumber(req.params.userId)) {

		// check userId matches with token
		Authentication.findOne({user: req.params.userId}, function(err, authen){
			if(err) {
				throw err;
			}
			if (authen == null || authen.token != req.params.token) {
				res.status(401).send({ error: "Token does not match." });
			} else {

				var messages = [];
				var applications = [];

				Message.find({to: req.params.userId}, function(err, messages) {
					if (err) {
						throw err;
					}
					Application.find({to: req.params.userId}, function(err, applications) {
						if (err) {
							throw err;
						}

						var m_count = 0;
						var a_count = 0;

						for (var i = 0; i < messages.length; i++) {
							if (!messages[i]['read'])
								m_count++;
						}

						for (var i = 0; i < applications.length; i++) {
							if (!applications[i]['read'])
								a_count++;
						}

						var data = {
							messages: m_count,
							applications: a_count
						};

						console.log(data);
						res.json(data);
					});
				});
			}
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

function isNumber(value) {
    return /^\d+$/.test(value);
};

function isString(value) {
    return /^\w+$/.test(value);
};
module.exports = router