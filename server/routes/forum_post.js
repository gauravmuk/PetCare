var express 	= require("express");
var router 		= express.Router();
var ForumPost 	= require('../../server/models/Forum_Post');

// Return all forum posts
router.get("/", function(req, res){
	var forumpost = [];
	ForumPost.find({}).sort([['created_at', 'descending']]).populate('user').exec(function(err, forumpost) {
		if (err) {
			throw err;
		}
		res.json(forumpost)
	});

});

// Post a new forum post
router.post("/", function(req, res){

	var forumpost = new ForumPost({
	    user: req.body.data.user,
		type: req.body.data.type,
		message: req.body.data.message,
		image: req.body.data.image,
		likes: req.body.data.likes,
	});

	forumpost.save(function(err) {
    	res.status(201).send({ _id: forumpost._id, message: forumpost.message, image: forumpost.image, likes: forumpost.likes });
	});

});

// Increases the 'likes' on a forum post by 1
router.put('/:id/like', function (req, res) {

	if (isNumber(req.params.id)) {

		ForumPost.findOne({_id: req.params.id}, function (err, forumpost) {

		    forumpost.likes = forumpost.likes + 1;

		    forumpost.save(function(err) {
    			res.status(200).send({ _id: forumpost._id, message: forumpost.message, image: forumpost.image, likes: forumpost.likes });
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