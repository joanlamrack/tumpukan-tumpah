const User = require("../models/users");
const AuthHelper = require("../helpers/authhelper");
const ObjectIdHelper = require("../helpers/objectIdhelper");
class AuthMiddleware {
	constructor() {}

	static checkifTokenExist(req, res, next) {
		if (req.headers.token) {
			next();
		} else {
			res.status(403).json({
				error: "not authorized"
			});
		}
	}

	//if valid, inject header with userId
	static checkifTokenValid(req, res, next) {
		try {
			let id = AuthHelper.decodeToken(req.headers.token).id;
			User.findById(id)
				.then(userfound => {
					if (userfound) {
						req.headers.userId = userfound.id;
						next();
					} else {
						res.status(400).json({
							error: "user not found"
						});
					}
				})
				.catch(err => {
					res.status(400).json({
						error: err.message
					});
				});
		} catch (error) {
			console.log(error);
			res.status(400).json({
				error: error.message
			});
		}
	}

	static isNotOwnedByUser(req, res, next) {
		User.aggregate([
			{
				$match: {
					$and: [
						{ _id: ObjectIdHelper.convertStringIntoObjId(req.headers.userId) },
						{
							$or: [
								{
									threads: ObjectIdHelper.convertStringIntoObjId(
										req.params.threadId
									)
								},
								{
									comments: ObjectIdHelper.convertStringIntoObjId(
										req.params.commentsId
									)
								}
							]
						}
					]
				}
			}
		])

			.then(userFound => {
				if (userFound.length) {
					res.status(406).json({
						error: "forbidden"
					});
				} else {
					next();
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	static isOwnedByUser(req, res, next) {
		User.aggregate([
			{
				$match: {
					$and: [
						{ _id: ObjectIdHelper.convertStringIntoObjId(req.headers.userId) },
						{
							$or: [
								{
									threads: ObjectIdHelper.convertStringIntoObjId(
										req.params.threadId
									)
								},
								{
									comments: ObjectIdHelper.convertStringIntoObjId(
										req.params.commentsId
									)
								}
							]
						}
					]
				}
			}
		])

			.then(userFound => {
				if (userFound.length) {
					next();
				} else {
					res.status(406).json({
						error: "forbidden"
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
}

module.exports = AuthMiddleware;
