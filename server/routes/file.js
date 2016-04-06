var fs 			= require('fs');
var multiparty 	= require('multiparty');
var AWS 		= require('aws-sdk');
var express 	= require("express");
var router 		= express.Router();

/* Amazon S3 Upload */
// connect to existing bucket
var s3bucket = new AWS.S3({ params: { Bucket: 'pet.care' }});

// Uploads a file to Amazon S3 and return the URL
// Following guide from: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html and
// https://gist.github.com/adon-at-work/26c8a8e0a1aee5ded03c
router.post("/", function(req, res){

	var fileForm = new multiparty.Form();
	var imageToUpload;

	// Parse the file from the form
    fileForm.parse(req, function(err, fields, files) {

		imageToUpload = files.file[0];

		// Check the filetype and size is 1MB
		if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(imageToUpload.path) && imageToUpload.size < 1000000) {

			s3bucket.createBucket(function() {

				var params = { Body: fs.createReadStream(imageToUpload.path), 
					Key: imageToUpload.originalFilename };

				s3bucket.upload(params, function(err, data) {
					if (err) {
						console.log("Error uploading data: ", err);
					} else {
						console.log("Successfully uploaded image.");
					}
				}).send(function(err, data) {

				    if (err) {
						console.log("Error uploading image. Please make sure you have set up your AWS credentials file.", 
							err);
						var imageJSON = '{ "url": null }';
						res.setHeader('Location', null);
						res.status(201).json(JSON.parse(imageJSON));
				    } else {
						var imageJSON = '{ "url": "' + data.Location + '"}';
						res.setHeader('Location', data.Location);
						res.status(201).json(JSON.parse(imageJSON));
					}
				});

			});
		} else {
			var imageJSON = '{ "url": null }';
			res.setHeader('Location', null);
			res.status(201).json(JSON.parse(imageJSON));
		}

    });
});

module.exports = router