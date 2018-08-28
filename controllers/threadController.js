let Thread = require("../models/threads");
let { responseErrorHandler } = require("../helpers/errorhandler");

class ThreadController {
	constructor() {}

	static createThread(req, res) {
		Thread.create({
			title: req.body.title,
			content: req.body.content,
			user: req.headers.userId
		})
			.then(userCreated => {
				res.status(200).json(userCreated);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getAllThreads(req, res) {
		Thread.aggregate([])
			.populate("user")
			.then(ThreadFound => {
				res.status(200).json(ThreadFound);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getThreadByid(req, res) {
		Thread.aggregate([{ $match: { id: req.params.threadId } }])
			.populate("user")
			.populate({ path: "comments", populate: "user" })
			.then(threadsFound => {
				if (threadsFound.length) {
					res.status(200).json(threadsFound[0]);
				} else {
					res.status(204);
				}
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getAllThreadsByUserId(req, res) {
		Thread.aggregate([{ $match: { user: req.headers.userId } }])
			.then(threadsbyuser => {
				res.status(200).json(threadsbyuser);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static deleteThreadById(req, res) {
		Thread.aggregate([{ $match: { id: req.params.id } }])
			.then(threadFound => {
				if (threadFound.length) {
					res.status(200).json(threadFound[0]);
					threadFound[0].remove();
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
		Thread.aggregate([{ $match: { id: req.params.threadId } }])
			.then(threadToBeUpVoted => {
				if (threadToBeUpVoted.length) {
					return threadToBeUpVoted.update({
						$push: { upvote: req.headers.userId }
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
		Thread.aggregate([{ $match: { id: req.params.threadId } }])
			.then(threadToBeUpVoted => {
				if (threadToBeUpVoted.length) {
					return threadToBeUpVoted.update({
						$push: { downvote: req.headers.userId }
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
