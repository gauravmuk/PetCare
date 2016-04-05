var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var ForumPostSchema = new Schema(
	{
	    user: {
	        type: Number,
	        ref: 'User'
	    },
		type: String,
		message: String,
		image: String,
		likes: Number
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}
);

ForumPostSchema.plugin(autoIncrement.plugin, {
	model: 		'ForumPost',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("ForumPost", ForumPostSchema);