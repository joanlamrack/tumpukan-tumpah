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
		.aggregate([{ $match: { _id: comment.user } }])
		.then(userWhoCreatedComment => {
			if (userWhoCreatedComment.length) {
				return userWhoCreatedComment[0].update({
					$pull: { comments: comment._id }
				});
			}
			next();
		})
		.then(updateresponse => {
			console.log(updateresponse);
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
