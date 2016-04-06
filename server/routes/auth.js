var express = require("express");
var router 	= express.Router();
var passport = require("passport");
var User	= require('../../server/models/User');
var Authentication  = require('../../server/models/Authentication');

// Register with username and password
router.post('/register', function(req, res, next) {
	var username 	= req.body.username;
	var password 	= req.body.password;
	var name 		= req.body.name;

	User.register(new User({ username: username, email: username, name: name, location: '',
		description: '', role: 'regular', photo: '/assets/images/default-profile-pic.png' }), password, function(err) {
		if (err) {
			res.json({ err: err });
		}
		else {
			passport.authenticate('local', { session: true })(req, res, function() {

				// create authentication token
				Authentication.findOne({user: req.user.id}, function(err, authen){
					if (authen == null) {
						var authen_token = Math.random()
						var authentication = new Authentication({
							user: req.user.id,
							token: authen_token,
						});
						authentication.save(function(err) {
					    	res.json({ id: req.user.id, name: req.user.name, role: req.user.role, token: authen_token});
						});
					} else {
						res.json({ id: req.user.id, name: req.user.name, role: req.user.role, token: authen.token});
					}
				});
			});
		}
	});
});

// Login with username and password
router.post('/login', passport.authenticate('local', { session: true, failWithError: true}), 
	function(req, res, next) {
		User.findOne({_id: req.user.id}, function(err, user){
			if(err) {
				return next(err);
			}
			else {
				if (user.banned) {
					res.json({ err: 'This account has been banned'})
				} 
				else {

					// create authentication token
					Authentication.findOne({user: req.user.id}, function(err, authen){
						if (authen == null) {
							var authen_token = Math.random()
							var authentication = new Authentication({
								user: req.user.id,
								token: authen_token,
							});
							authentication.save(function(err) {
						    	res.json({ id: req.user.id, name: req.user.name, role: req.user.role, token: authen_token});
							});
						} else {
							res.json({ id: req.user.id, name: req.user.name, role: req.user.role, token: authen.token});
						}
					});
				}
			}
		});	
	},
	function(err, req, res, next) {
		res.status(200).json({ err: err });
	}
);

// Logout
router.get('/logout', function(req, res) {
	// Remove mapping between userId and token
	if (req.user) {
		Authentication.remove({user: req.user._id}, function(err, result){
			if(err) {
				throw err;
			} else {
				req.logout();
				res.end();
			}
		});
	}
	else {
		res.end();
	}
});

// Send the authentication status
router.get('/status', function(req, res) {
	if (!req.isAuthenticated()) {
		res.json({ logged_in: false });
	}
	else {

		// create authentication token
		Authentication.findOne({user: req.user._id}, function(err, authen){
			if (authen == null) {

				// If there is no token to the user, create one
				var authen_token = Math.random()
				var authentication = new Authentication({
					user: req.user._id,
					token: authen_token,
				});
				authentication.save(function(err) {
					res.json({
						logged_in: true,
						is_banned: req.user.banned,
						user: {
							id: req.user._id,
							name: req.user.name,
							role: req.user.role,
							token: authen_token,
						}
					});
				});
			} else { // otherwise, send the one in db
				res.json({
					logged_in: true,
					is_banned: req.user.banned,
					user: {
						id: req.user._id,
						name: req.user.name,
						role: req.user.role,
						token: authen.token,
					}
				});
			}
		});
	}
});

// Login or Sign up with twitter account
router.get('/twitter', passport.authenticate('twitter', { session: true }));

router.get('/twitter/callback', 
	passport.authenticate('twitter', { session: true, failureRedirect: '/signin' }),
	function(req, res) {
		res.redirect('/');
	}
);

// Login or Sign up with facebook account
router.get('/facebook', passport.authenticate('facebook', { session: true, scope: ['email', 'user_location'] }));

router.get('/facebook/callback', 
	passport.authenticate('facebook', { session: true, failureRedirect: '/signin' }),
	function(req, res) {
		res.redirect('/');
	}
);

module.exports = router