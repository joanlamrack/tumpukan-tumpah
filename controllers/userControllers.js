const User = require("../models/users");
const AuthHelper = require("../helpers/authhelper");
const ObjectIdHelper = require("../helpers/objectIdhelper");
const PassWordGenerator = require("generate-password");

class UserController {
	constructor() {}

	static signup(req, res) {
		User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})
			.then(response => {
				res.status(201).json(response);
			})
			.catch(err => {
				res.status(400).json({
					error: err.message
				});
			});
	}

	static login(req, res) {
		User.aggregate([{ $match: { email: req.body.email } }])
			.then(userFound => {
				let passwordisRight = AuthHelper.comparehash(
					req.body.email + req.body.password,
					userFound[0].password
				);
				if (userFound.length && passwordisRight) {
					let token = AuthHelper.createToken({
						id: ObjectIdHelper.extractIdStringFromObj(userFound[0])
					});
					res.status(200).json({
						token: token
					});
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
	}

	static forgotPassword(req, res) {
		//Menerima email, kalau ada dalam database, email link reset password dikirim ke email
		
	}

	static googleSignUp(req, res) {
		//Menerima User Name dan email
		//kalau baru, create random password, kirim lewat email
		let randomPassword = PassWordGenerator.generate();
		req.body.password = randomPassword;
		//Kirim email berisikan password
		this.signup(req,res);
	}
}

module.exports = UserController;
