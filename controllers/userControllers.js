const User = require("../models/users");
const AuthHelper = require("../helpers/authhelper");
const ObjectIdHelper = require("../helpers/objectIdhelper");
const PassWordGenerator = require("generate-password");
const mailModule = require("../libs/mailModule");

class UserController {
	constructor() {}

	static signup(req, res) {
		User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})
			.then(response => {
				//send email

				res.status(201).json(response);
			})
			.catch(err => {
				console.log(err)
				res.status(400).json({
					error: err.message
				});
			});
	}

	static login(req, res) {
		User.aggregate([{ $match: { email: req.body.email } }])
			.then(userFound => {
				if (userFound.length) {
					let passwordisRight = AuthHelper.comparehash(
						req.body.email + req.body.password,
						userFound[0].password
					);
					if (passwordisRight) {
						let token = AuthHelper.createToken({
							id: ObjectIdHelper.extractIdStringFromObj(userFound[0])
						});
						res.status(200).json({
							token: token
						});
					} else {
						res.status(404).json({
							error: "Email or password wrong"
						});
					}
				} else {
					res.status(404).json({
						error: "Email or Password Wrong"
					});
				}
			})
			.catch(err => {
				res.status(400).json({
					error: err.message
				});
			});
	}

	static resetPassword(req, res) {
		User.findOne({
			_id: ObjectIdHelper.convertStringIntoObjId(req.headers.userId)
		})
			.then(userFound => {
				if (Object.keys(userFound).length) {
					//kirim email dengan link reset
					userFound.password = req.body.password;
					userFound.save();
				} else {
					res.status(404).json({
						error: "not found"
					});
				}
			})
			.catch(err => {
				res.status(400).json({
					error: err.message
				});
			});
	}

	static forgotPassword(req, res) {
		//Menerima email, kalau ada dalam database, email link reset password dikirim ke email
		User.findOne({ email: req.body.email })
			.then(userFound => {
				if (Object.keys(userFound).length) {
					//kirim email dengan link reset
					mailModule(
						userFound.email,
						"alert-reset-password",
						`${process.env.BASE_URL}/reset/${userFound._id}`
					);
				} else {
					res.status(404).json({
						error: "not found"
					});
				}
			})
			.catch(err => {
				res.status(400).json({
					error: err.message
				});
			});
	}

	static googleSignUp(req, res) {
		//Menerima User Name dan email
		//kalau baru, create random password, kirim lewat email
		let randomPassword = PassWordGenerator.generate();
		req.body.password = randomPassword;
		//Kirim email berisikan password
		this.signup(req, res);
	}
}

module.exports = UserController;
