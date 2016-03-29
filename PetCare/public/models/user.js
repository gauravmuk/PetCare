var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		name: String,
		username: String,
		location: String,
		description: String,
		rating: Number,
		role: String,
		photo: String,
		banned: Boolean
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