var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	created_at: Date,
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
	message: String,
	read: Boolean,
});

module.exports = mongoose.model("Message", MessageSchema);