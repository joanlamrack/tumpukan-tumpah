const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Authhelper = require("../helpers/authhelper");

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
		}
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

// UserSchema.pre("remove", function(next) {
// 	let user = this;

// 	user
// 		.model("Article")
// 		.remove({ _id: { $in: user.articles } })
// 		.then(response => {
// 			next();
// 		})
// 		.catch(err => {
// 			res.status(400).json({
// 				message: err.message,
// 				data: err
// 			});
// 		});
// });

module.exports = mongoose.model("User", UserSchema);
