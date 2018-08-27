const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthHelper{
	constructor(){

	}

	static hashpass(password){
		return bcrypt.hashSync(password);
	}

	static comparehash(password,hashedPassword){
		return bcrypt.compareSync(password,hashedPassword);
	}

	static createToken(ObjUserId){
		return jwt.sign(ObjUserId,process.env.secret);
	}

	static decodeToken(token){
		return jwt.verify(token,process.env.secret);
	}
} 

module.exports = AuthHelper;