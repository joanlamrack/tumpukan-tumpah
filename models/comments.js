const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostModel = require("./posts.js");
const ObjectIdHelper = require("../helpers/objectIdhelper");

const options = {
	discriminatorKey: "posttype",
	timestamps: {
		createdAt: "createdAt",
		updatedAt: "updatedAt"
	}
};

let commentSchema = new Schema(
	{
		thread: {
			type: Schema.Types.ObjectId,
			ref: "Thread",
			required: true
		}
	},
	options
);

commentSchema.pre("remove", function(next) {
	let comment = this;
	comment
		.model("User")
		.findOneAndUpdate(
			{ _id: comment.user },
			{
				$pull: { comments: comment._id }
			}
		)
		.then(updateresponse => {
			console.log(updateresponse);
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

commentSchema.pre("save", function(next) {
	let comment = this;
	comment
		.model("User")
		.findOneAndUpdate(
			{ _id: ObjectIdHelper.convertStringIntoObjId(comment.user) },
			{ $push: { comments: comment.id } }
		)
		.then(response => {
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

let CommentModelByDiscriminator = PostModel.discriminator(
	"Comment",
	commentSchema
);

module.exports = CommentModelByDiscriminator;
