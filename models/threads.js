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

let threadSchema = new Schema(
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
				ref: "Comment",
				required: true
			}
		]
	},
	options
);

threadSchema.pre("remove", function(next) {
	let thread = this;
	thread
		.model("Comment")
		.aggregate([{ $match: { _id: { $in: thread.comments } } }])
		.then(commentsInThread => {
			if (commentsInThread.length) {
				commentsInThread.forEach(comment => {
					comment.remove();
				});
			}
			return thread.model("User").aggregate([{ $match: { _id: thread.user } }]);
		})
		.then(UserWhoOwnedThread => {
			return UserWhoOwnedThread.update({ $pull: { threads: thread.user } });
		})
		.then(userUpdateResponse => {
			console.log(userUpdateResponse);
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

let ThreadModelByDiscriminator = PostModel.discriminator(
	"Thread",
	threadSchema
);

module.exports = ThreadModelByDiscriminator;
