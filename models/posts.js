const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//PostSchema will serve Post and Thread as Base Schema

const baseSchemaOptions = {
	discriminatorKey: "posttype",
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt"
	}
}

let PostSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref:"User"
		},
		content: {
			type: String,
			required: true,
		},
		upvote:{
			type:Number,
			default:0
		},
		downvote:{
			type:Number,
			default:0
		}
	},
	baseSchemaOptions
);


module.exports = mongoose.model("Post", PostSchema);
