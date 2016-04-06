var express = require("express");
var router 	= express.Router();
var Report 	= require('../../server/models/Report');

router.get("/", function(req, res){
	var report = [];
	Report.find({}).populate('to').populate('from').exec(function(err, report) {
		if (err) {
			throw err;
		}
		res.json(report)
	});
});

router.post("/", function(req, res){
	var to 			= req.body.data.to;
	var from 		= req.body.data.from;
	var reportMsg	= req.body.data.reportMsg;

	var newReport = new Report({
		to: to,
		from: from,
		message: reportMsg
	});

	newReport.save(function(err, report) {
		if(err){
			res.setHeader('Location', '/');
    		res.status(400).send({ error: "Error Creating Report" });
		}
		else{
			res.json({report: report});
		}
	});
});

router.get("/:id", function(req, res){

	if (isNumber(req.params.id)) {
		var report = [];
		Report.findById(req.params.id, function(err, report) {
			if (err) {
				throw err;
			}
			res.json(report)
		});

	} else {
		res.status(400).send({ error: "Invalid ID" });
	}
});

function isNumber(value) {
    return /^\d+$/.test(value);
};

module.exports = router