var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	created_at: Date,
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	rating: Number,
	comment: String,
});

module.exports = mongoose.model("Review", ReviewSchema);