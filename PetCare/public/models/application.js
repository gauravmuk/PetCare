var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
	created_at: Date,
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pet_posting: {
        type: Schema.Types.ObjectId,
        ref: 'PetPosting'
    },
    sitter_posting: {
        type: Schema.Types.ObjectId,
        ref: 'SitterPosting'
    },
	message: String,
});

module.exports = mongoose.model("Application", ApplicationSchema);