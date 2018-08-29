const PassWordGenerator = require("generate-password");

class GoogleMiddleware{
	constructor(){

	}

	static googleSignUp(res,res,next){
		//Menerima User Name dan email
		//kalau baru, create random password, kirim lewat email
		let randomPassword = PassWordGenerator.generate();
		req.body.password = randomPassword;
		//Kirim email berisikan password
		next()
	}
}

module.exports = GoogleMiddleware