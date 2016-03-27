var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var PetSchema = new Schema(
	{
	    user: {
	        type: Number,
	        ref: 'User'
	    },
		name: String,
		type: String,
		breed: String,
		gender: String,
		age: String,
		description: String,
		rating: Number,
		photo: String
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}
);

PetSchema.plugin(autoIncrement.plugin, {
	model: 		'Pet',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("Pet", PetSchema);