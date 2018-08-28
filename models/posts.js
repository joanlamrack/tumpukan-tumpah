const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//PostSchema will serve Post and Thread as Base Schema

const baseSchemaOptions = {
	discriminatorKey: "posttype",
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt"
	}
};

let PostSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		content: {
			type: String,
			required: true
		},
		upvote: [
			{
				type: Schema.Types.ObjectId,
				ref: "User"
			}
		],
		downvote: [
			{
				type: Schema.Types.ObjectId,
				ref: "User"
			}
		]
	},
	baseSchemaOptions
);

PostSchema.methods.isAlreadyVoted = function(userid) {
	//find if user is already in one of the upvotes / downvotes
	this.upvote.forEach(upvoteByUser => {
		if (upvoteByUser.id === userid || upvoteByUser === userid) {
			return true;
		}
	});

	this.downvote.forEach(downvoteByUser => {
		if (downvoteByUser.id === userid || downvoteByUser === userid) {
			return true;
		}
	});

	return false;
};

module.exports = mongoose.model("Post", PostSchema);
