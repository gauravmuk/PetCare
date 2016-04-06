var express = require("express");
var router 	= express.Router();
var Authentication  = require('../../server/models/Authentication');
var Message 		= require('../../server/models/Message');

// Post a new message
router.post("/", function(req, res){

	// check userId matches with token
	Authentication.findOne({user: req.body.from}, function(err, authen){
		if(err) {
			throw err;
		}
		if (authen == null || authen.token != req.body.token) {
			res.status(401).send({ error: "Token does not match." });
		} else {
			var msg = new Message({
				from: req.body.from,
				to: req.body.to,
				message: req.body.message,
				read: false,
			});

			msg.save(function(err) {
		    	res.status(201).send(null);
			});
		}
	});
});

// Update read status of the given message
router.put("/:msg_id/read", function(req, res){

	if (isNumber(req.params.msg_id)) {

		var msg = [];

		Message.findByIdAndUpdate(req.params.msg_id, {$set: {read:true}}, function(err, msg){
			if (err) throw err;
    		res.status(201).send(null);
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}

});

// Get inbox and Sent messages of the given user
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
				var inbox = [];
				var sent = [];
				Message.find({ to: req.params.userId }).populate('from').exec(function(err, inbox) {
					if (err) {
						throw err;
					}
					Message.find({ from: req.params.userId }).populate('to').exec(function(err, sent) {
						if (err) {
							throw err;
						}

						// create JSON object
						var inbox_json = [];
						var sent_json = [];

						for (var i = 0; i < inbox.length; i++) {
							inbox_json.push({
								from: inbox[i]['from']['name'],
								from_id: inbox[i]['from']['_id'],
								created_at: inbox[i]['created_at'],
								message: inbox[i]['message'],
								read: inbox[i]['read'],
								msg_id: inbox[i]['_id']
							});
						}

						for (var i = 0; i < sent.length; i++) {
							sent_json.push({
								to: sent[i]['to']['name'],
								created_at: sent[i]['created_at'],
								message: sent[i]['message'],
								read: sent[i]['read']
							});
						}

						var data = {
							inbox: inbox_json,
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

function isNumber(value) {
    return /^\d+$/.test(value);
};

module.exports = router