let Thread = require("../models/threads");
let { responseErrorHandler } = require("../helpers/errorhandler");
let ObjectIdHelper = require("../helpers/objectIdhelper");
class ThreadController {
	constructor() {}

	static createThread(req, res) {
		Thread.create({
			title: req.body.title,
			content: req.body.content,
			user: req.headers.userId,
			tags: req.body.tags
		})
			.then(userCreated => {
				res.status(200).json(userCreated);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getAllThreads(req, res) {
		Thread.find({})
			.populate("user")
			.then(ThreadFound => {
				res.status(200).json(ThreadFound);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getThreadByid(req, res) {
		Thread.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.threadId)
		})
			.populate("user")
			.populate({
				path: "comments",
				populate: "user"
			})
			.then(threadsFound => {
				if (Object.keys(threadsFound).length) {
					res.status(200).json(threadsFound);
				} else {
					res.status(404).json({ error: "Not Found" });
				}
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getAllThreadsByUserId(req, res) {
		Thread.find({
			user: ObjectIdHelper.convertStringIntoObjId(req.headers.userId)
		})
			.then(threadsbyuser => {
				res.status(200).json(threadsbyuser);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static deleteThreadById(req, res) {
		Thread.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.threadId)
		})
			.then(threadFound => {
				if (Object.keys(threadFound).length) {
					threadFound.remove(function(err) {
						console.log(err);
						res.status(200).json(threadFound);
					});
				} else {
					res.status(204);
				}
			})

			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static patchThreadById(req, res) {
		Thread.findByIdAndUpdate(req.params.threadId, {
			title: req.body.title,
			content: req.body.content,
			tags: req.body.tags
		})
			.then(updatedThread => {
				res.status(200).json(updatedThread);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static upvoteThreadById(req, res) {
		Thread.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.threadId)
		})
			.then(threadToBeUpVoted => {
				if (
					Object.keys(threadToBeUpVoted).length &&
					!threadToBeUpVoted.isAlreadyVoted(req.headers.userId)
				) {
					return threadToBeUpVoted.update({
						$push: {
							upvotes: ObjectIdHelper.convertStringIntoObjId(req.headers.userId)
						}
					});
				} else {
					res.status(404).json({
						error: "not found"
					});
				}
			})
			.then(updateResponse => {
				res.status(200).json(updateResponse);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static downvoteThreadById(req, res) {
		Thread.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.threadId)
		})
			.then(threadToBeUpVoted => {
				if (
					Object.keys(threadToBeUpVoted).length &&
					!threadToBeUpVoted.isAlreadyVoted(req.headers.userId)
				) {
					return threadToBeUpVoted.update({
						$push: { downvotes: req.headers.userId }
					});
				} else {
					res.status(404).json({
						error: "not found"
					});
				}
			})
			.then(updateResponse => {
				res.status(200).json(updateResponse);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}
}

module.exports = ThreadController;
