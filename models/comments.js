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

let CommentModelByDiscriminator = PostModel.discriminator("Comment", new Schema(
	{
		thread:{
			type: Schema.Types.ObjectId,
			ref:"Thread",
			required:true
		}
	},
	options
));

module.exports = CommentModelByDiscriminator;
