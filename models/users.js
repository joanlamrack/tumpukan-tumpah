const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Authhelper = require("../helpers/authhelper");
const { responseErrorHandler } = require("../helpers/errorhandler.js");
const mailModule = require("../libs/mailModule");
var CronJob = require("cron").CronJob;
var kue = require("kue"),
	queue = kue.createQueue();

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

UserSchema.post("save", function(doc) {
	console.log("Entering post save");

	var today = new Date();
	var mnt = today.getMinutes() + 1;
	var hours = today.getHours();
	var dd = today.getDate();
	var mm = today.getMonth();

	var schedule = `${mnt} ${hours} ${dd} ${mm} *`;

	console.log(schedule);
	
	new CronJob(
		schedule,
		function() {
			var job = queue
				.create("email", {
					title: "welcome email for tj",
					to: "tj@learnboost.com",
					template: "welcome-email"
				})
				.save(function(err) {
					if (!err) {
						console.log("sent email");
					} else {
						console.log(err);
					}
				});
		},
		null,
		true,
		"Asia/Jakarta"
	);

	queue.process("email", function(job, done) {
		mailModule.createAndSendEmail(doc.email, "registered-manual", doc.name, done);
		
	});

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
		.find({ user: user._id })
		.then(threadsByUser => {
			if (threadsByUser.length) {
				for (let thread of threadsByUser) {
					thread.remove(function(err) {
						console.log(err);
					});
				}
			}
			return user.model("Comment").find({ user: user._id });
		})
		.then(commentsByUser => {
			if (commentsByUser.length) {
				for (let comment of commentsByUser) {
					comment.remove(function(err) {
						console.log(err);
					});
				}
			}
			next();
		})
		.catch(err => {
			responseErrorHandler(err);
		});
});

module.exports = mongoose.model("User", UserSchema);
