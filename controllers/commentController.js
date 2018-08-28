const Comment = require("../models/comments");
let { responseErrorHandler } = require("../helpers/errorhandler");
const ObjectIdHelper = require("../helpers/objectIdhelper");
class CommentController {
	constructor() {}

	static createComment(req, res) {
		Comment.create({
			content: req.body.content,
			Comment: req.query.CommentId,
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
		Comment.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.commentId)
		})
			.then(commentFound => {
				if (Object.keys(commentFound).length) {
					res.status(200).json(commentFound);
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
		Comment.find({
			user: ObjectIdHelper.convertStringIntoObjId(req.header.userId)
		})
			.then(commentsByUser => {
				res.status(200).json(commentsByUser);
			})
			.catch(err => {
				responseErrorHandler(err, res);
			});
	}

	static deleteCommentById(req, res) {
		Comment.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.threadId)
		})
			.then(commentFound => {
				if (Object.keys(commentFound).length) {
					commentFound.remove(function(err) {
						console.log(err);
						res.status(200).json(commentFound);
					});
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
		Comment.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.commentId)
		})
			.then(commentToBeUpVoted => {
				if (
					Object.keys(commentToBeUpVoted).length &&
					!commentToBeUpVoted.isAlreadyVoted(req.headers.userId)
				) {
					return commentToBeUpVoted.update({
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

	static downvoteCommentById(req, res) {
		Comment.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.params.commentId)
		})
			.then(commentToBeUpVoted => {
				if (
					Object.keys(commentToBeUpVoted).length &&
					!commentToBeUpVoted.isAlreadyVoted(req.headers.userId)
				) {
					return commentToBeUpVoted.update({
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

module.exports = CommentController;
