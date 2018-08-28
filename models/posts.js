const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectIdHelper = require("../helpers/objectIdhelper");

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
		upvotes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User"
			}
		],
		downvotes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User"
			}
		]
	},
	baseSchemaOptions
);

PostSchema.methods.getUserOwnVote = function(userid) {
	if (userid) {
		for (let upvote of this.upvotes) {
			if (ObjectIdHelper.convertObjectIdToStr(upvote) === userid) {
				return "upvote";
			}
		}

		for (let downvote of this.downvotes) {
			if (ObjectIdHelper.convertObjectIdToStr(downvote) === userid) {
				return "downvote";
			}
		}
	}
};

PostSchema.methods.isAlreadyVoted = function(userid) {
	//find if user is already in one of the upvotes / downvotes
	if (userid) {
		for (let upvote of this.upvotes) {
			if (ObjectIdHelper.convertObjectIdToStr(upvote) === userid) {
				return true;
			}
		}

		for (let downvote of this.downvotes) {
			if (ObjectIdHelper.convertObjectIdToStr(downvote) === userid) {
				return true;
			}
		}
	}

	return false;
};

module.exports = mongoose.model("Post", PostSchema);
