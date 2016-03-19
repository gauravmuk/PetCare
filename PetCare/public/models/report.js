var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
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
    resolve: Boolean,
});

module.exports = mongoose.model("Report", ReportSchema);