const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Authhelper = require("../helpers/authhelper");
const { responseErrorHandler } = require("../helpers/errorhandler.js");

let UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 1
		},
		verified: {
			type: Boolean,
			required: true,
			default: false
		},
		email: {
			type: String,
			required: true,
			unique: true,
			minlength: 1,
			match: [
				/^\w+@([a-z]+\.)+[a-z]{2,3}$/,
				"Please input a valid email format"
			]
		},
		password: {
			type: String,
			required: true,
			minlength: [8, "Password Length minimum 8"]
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment"
			}
		],
		threads: [
			{
				type: Schema.Types.ObjectId,
				ref: "Thread"
			}
		]
	},
	{
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt"
		}
	}
);

UserSchema.pre("save", function(next) {
	if (this.isNew) {
		let user = this;
		let password = Authhelper.hashpass(user.email + user.password);
		user.password = password;
	}
	next();
});

UserSchema.post("save", function(error, doc, next) {
	if (error.name === "MongoError" && error.code === 11000) {
		next(new Error("email must be unique"));
	} else {
		next(error);
	}
});

UserSchema.pre("remove", function(next) {
	//Pada saat user di remove, remove juga Comment dan Thread yang mereka buat.
	//Usahakan pakai Doc.Remove biar trigger semua pre hooksnya
	let user = this;
	user
		.model("Thread")
		.aggregate([{ $match: { user: user._id } }])
		.then(threadsByUser => {
			if (threadsByUser.length) {
				for (let thread of threadsByUser) {
					thread.remove();
				}
			}
			return user.model("Comment").aggregate([{ $match: { user: user._id } }]);
		})
		.then(commentsByUser => {
			if (commentsByUser.length) {
				for (let comment of commentsByUser) {
					comment.remove();
				}
			}
			next();
		})
		.catch(err => {
			responseErrorHandler(err);
		});
});

module.exports = mongoose.model("User", UserSchema);
