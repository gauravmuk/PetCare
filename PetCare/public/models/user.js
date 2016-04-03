var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		name: 	String,
		username: String,
		email: String,
		location: String,
		description: String,
		rating: { type: Number, default: 0 },
		role: String,
		photo: String,
		banned: { type: Boolean, default: false },
		facebook_id: Number,
		twitter_id: Number,
		facebook_access_token: String,
		twitter_access_token: String
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}
);

UserSchema.plugin(autoIncrement.plugin, {
	model: 		'User',
	field: 		'_id',
	startAt: 	1
});

UserSchema.plugin(passportLocalMongoose, {
	usernameUnique: true
});

module.exports = mongoose.model("User", UserSchema);