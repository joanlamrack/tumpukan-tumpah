const Comment = require("../models/comments");
let { responseErrorHandler } = require("../helpers/errorhandler");

class CommentController {
	constructor() {}

	static createComment(req, res) {
		Comment.create({
			content: req.body.content,
			thread: req.query.threadId,
			user: req.headers.userId
		})
			.then(createdUser => {
				res.status(200).json(createdUser);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getCommentById(req, res) {
		Comment.aggregate([{ $match: { id: req.params.commentId } }])
			.then(commentFound => {
				if (commentFound.length) {
					res.status(200).json(commentFound[0]);
				} else {
					res.status(404).json({
						error: "not found"
					});
				}
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static getCommentByUserId(req, res) {
		Comment.aggregate([{ $match: { user: req.headers.userId } }])
			.then(commentsByUser => {
				res.status(200).json(commentsByUser);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static deleteCommentById(req, res) {
		Comment.aggregate([{ $match: { id: req.params.commentId } }])
			.then(commentFound => {
				if (commentFound.length) {
					commentFound[0].remove();
					res.status(200).json(commentFound[0]);
				} else {
					res.status(404).json({ error: "not found" });
				}
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static patchCommentById(req, res) {
		Comment.findByIdAndUpdate(req.params.commentId, {
			content: req.body.content
		})
			.then(commentFound => {
				if (commentFound.length) {
					res.status(200).json(commentFound[0]);
				} else {
					res.status(404).json({ error: "not found" });
				}
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static upvoteCommentById(req, res) {
		Comment.aggregate([{ $match: { id: req.params.commentId } }])
			.then(commentToBeUpVoted => {
				if (commentToBeUpVoted.length) {
					return commentToBeUpVoted.update({
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

	static downvoteCommentById(req, res) {
		Comment.aggregate([{ $match: { id: req.params.commentId } }])
			.then(commentToBeUpVoted => {
				if (commentToBeUpVoted.length) {
					return commentToBeUpVoted.update({
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

module.exports = CommentController;
