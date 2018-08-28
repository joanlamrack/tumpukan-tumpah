module.exports = {
	responseErrorHandler: function(error, res) {
		res.status(400).json(error);
	},
	middlewareErrorHandler: function(error) {
		console.log(error);
	}
};
