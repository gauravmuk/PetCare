var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AuthenticationSchema = new Schema(
    {
        user: Number,
        token: String
    }
);

module.exports = mongoose.model("Authentication", AuthenticationSchema);