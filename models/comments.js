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
		.findOneAndUpdate(
			{ _id: comment.user },
			{
				$pull: { comments: comment._id }
			}
		)
		.then(updateresponse => {
			console.log(updateresponse);
			return comment
				.model("Thread")
				.findByIdAndUpdate(
					{ _id: comment.thread },
					{ $pull: { comments: comment._id } }
				);
		})
		.then(updatecommentresponse => {
			console.log(updatecommentresponse);
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
			{ _id: comment.user },
			{ $push: { comments: comment._id } }
		)
		.then(response => {
			console.log(response);
			return comment
				.model("Thread")
				.findOneAndUpdate(
					{ _id: comment.thread },
					{ $push: { comments: comment._id } }
				);
		})
		.then(ressponse => {
			console.log(ressponse);
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
