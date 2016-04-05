var uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/testDB";

module.exports = {
	uri : uri
};