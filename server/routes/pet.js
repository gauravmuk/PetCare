var express = require("express");
var router 	= express.Router();
var Pet 	= require.main.require('./server/models/Pet');

router.get("/:id", function(req, res){

	if (isNumber(req.params.id)) {

		var pet = [];
		Pet.findById(req.params.id, function(err, pet) {
			if (err) {
				throw err;
			}
			res.json(pet)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

router.post("/", function(req, res){

	var newPet = new Pet({
		user: req.body.data.user,
		name: req.body.data.name,
		type: req.body.data.type,
		breed: req.body.data.breed,
		gender: req.body.data.gender,
		age: req.body.data.age,
		description: req.body.data.description,
		rating: req.body.data.rating,
		photo: req.body.data.photo || '/assets/images/default-pet-pic.jpg'
	});

	newPet.save(function(err) {
		res.setHeader('Location', '/users/' + newPet.user);
    	res.status(201).send({ id: newPet._id, name: newPet.name, type: newPet.type, breed: newPet.breed });
	});

});

// Update pet information
router.put("/:id", function (req, res) {

	if (isNumber(req.params.id)) {
		Pet.findOne({ _id: req.params.id }, function (err, pet) {
		    pet.name 			= req.body.data.name;
		    pet.type 	 		= req.body.data.type;
		    pet.age				= req.body.data.age;
		    pet.gender 			= req.body.data.gender;
		    pet.breed 			= req.body.data.breed;
		    pet.description 	= req.body.data.description;
		    if (req.body.data.photo) {
		    	pet.photo = req.body.data.photo;
		    }

		    pet.save(function (err, pet) {
		        if (err) {
		        	throw err;
		        }
    			res.status(200);
    			res.json(pet);
		    });
		});
	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

}); 

function isNumber(value) {
    return /^\d+$/.test(value);
};


module.exports = router