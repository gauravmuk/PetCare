var express = require("express");
var router 	= express.Router();
var Authentication  = require.main.require('./server/models/Authentication');
var Application 	= require.main.require('./server/models/Application');
var Pet_Posting 	= require.main.require('./server/models/Pet_Posting');
var Sitter_Posting	= require.main.require('./server/models/Sitter_Posting');


// Get Received and Sent applications of the given user
router.get("/:userId/:token", function(req,res){

	if (isNumber(req.params.userId)) {

		// check userId matches with token
		Authentication.findOne({user: req.params.userId}, function(err, authen){
			if(err) {
				throw err;
			}
			if (authen == null || authen.token != req.params.token) {
				res.status(401).send({ error: "Token does not match." });
			} else {

				var received = [];
				var sent = [];

				Application.find({to: req.params.userId}).populate('from').exec(function(err, received) {
					if (err) {
						throw err;
					}
					Application.find({from: req.params.userId}).populate('to').exec(function(err, sent) {
						if (err) {
							throw err;
						}

						// create JSON object
						var received_json = [];
						var sent_json = [];

						for (var i = 0; i < received.length; i++) {
							if (received[i]['isPetPost']) {
								var posting_id = received[i]['pet_posting'];
								var url = "/pet_posts/" + posting_id;

							} else {
								var posting_id = received[i]['sitter_posting'];
								var url = "/petsitter_posts/" + posting_id;
							}
							received_json.push({
								from: received[i]['from']['name'],
								from_id: received[i]['from']['_id'],
								created_at: received[i]['created_at'],
								message: received[i]['message'],
								url: url,
								posting_id: posting_id,
								read: received[i]['read'],
								app_id: received[i]['_id']
							});
						}

						for (var i = 0; i < sent.length; i++) {
							if (sent[i]['isPetPost']) {
								var posting_id = sent[i]['pet_posting'];
								var url = "/pet_posts/" + posting_id;
							} else {
								var posting_id = sent[i]['sitter_posting'];
								var url = "/petsitter_posts/" + posting_id;
							}
							sent_json.push({
								to: sent[i]['to']['name'],
								created_at: sent[i]['created_at'],
								message: sent[i]['message'],
								url: url,
								posting_id: posting_id,
								read: sent[i]['read']
							});
						}

						var data = {
							received: received_json,
							sent: sent_json
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


// Post a new application
router.post("/", function(req, res){

	// check userId matches with token
	Authentication.findOne({user: req.body.from}, function(err, authen){
		if(err) {
			throw err;
		}
		if (authen == null || authen.token != req.body.token) {
			res.status(401).send({ error: "Token does not match." });
		} else {
			var post = [];
			var Posting; // either pet_posting or sitter_posting depends on posting type.

			if (req.body.isPetPost == 'true') {
				Posting = Pet_Posting;
			} else {
				Posting = Sitter_Posting;
			}

			Posting.find({_id: req.body.posting_id}, function(err, post){
				if (err) {
					throw err;
				}
				var application = new Application({
					from: req.body.from,
					to: post[0]['user'],
					pet_posting: req.body.posting_id,
					sitter_posting: req.body.posting_id,
					message: req.body.message,
					isPetPost: req.body.isPetPost,
					read: false
				});
				application.save(function(err) {
			    	res.status(201).send(null);
				});
			});
		}
	});
});


// Update read status of the given application
router.put("/:app_id/read", function(req, res){

	if (isNumber(req.params.app_id)) {

		var app = [];

		Application.findByIdAndUpdate(req.params.app_id, {$set: {read:true}}, function(err, app){
			if (err) 
				throw err;
			res.status(200).send(null);
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

function isNumber(value) {
    return /^\d+$/.test(value);
};

module.exports = router