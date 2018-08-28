const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostModel = require("./posts.js");
const options = {
	discriminatorKey: "posttype",
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt"
	}
};

let ThreadModelByDiscriminator = PostModel.discriminator(
	"Thread",
	new Schema(
		{
			tags: [
				{
					type: String,
					required: true
				}
			],
			title: {
				type: String,
				required: true
			},
			comments: [
				{
					type: Schema.Types.ObjectId,
					ref: "Thread",
					required: true
				}
			]
		},
		options
	)
);

module.exports = ThreadModelByDiscriminator;
