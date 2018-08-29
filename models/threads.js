const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectIdHelper = require("../helpers/objectIdhelper");
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
		.find({ _id: { $in: thread.comments } })
		.then(commentsInThread => {
			console.log(commentsInThread);
			if (commentsInThread.length) {
				commentsInThread.forEach(comment => {
					comment
						.remove()
						.then(response => {
							console.log(response);
						})
						.catch(err => {
							console.log(err);
						});
				});
			}
			return thread
				.model("User")
				.updateOne({ _id: thread.user }, { $pull: { threads: thread._id } });
		})
		.then(userUpdateResponse => {
			console.log(userUpdateResponse);
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

threadSchema.pre("save", function(next) {
	let thread = this;
	thread
		.model("User")
		.findOneAndUpdate(
			{ _id: thread.user },
			{ $push: { threads: thread._id } }
		)
		.then(response => {
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
