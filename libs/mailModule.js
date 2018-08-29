const request = require("request-promise");
const fs = require("fs");
const BasicAuth = require("../helpers/authhelper").createBasicAuth;
const querystring = require("querystring");

const template = {
	"registered-manual": {
		html: fs.readFileSync("./email-templates/action.html", "utf8"),
		subject: "Kamu sudah menjadi bagian dari Tumpukan!",
		vars: "username"
	},
	"alert-reset-password": {
		html: fs.readFileSync("./email-templates/alert.html", "utf8"),
		subject: "Kamu Lupa password?",
		vars: "link"
	}
};

class MailController {
	constructor() {}

	static sendEmail(emailTemplate, to) {
		let authorization = BasicAuth(
			process.env.MAILGUN_USERNM,
			process.env.MAILGUN_APIKEY
		);
		let uri = process.env.MAILGUN_DOMAIN;

		let options = {
			method: "POST",
			uri: uri,
			headers: {
				Authorization: authorization,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: querystring.stringify({
				from: "Tumpukan Tumpah Bot <mailgun@mg.joanlamrack.me>",
				to: [to, "mg@mg.joanlamrack.me"],
				subject: emailTemplate.subject,
				html: emailTemplate.html
			})
		};
		
		request(options)
			.then(response => {
				console.log(response);
			})
			.catch(err => {
				console.log(err);
			});
	}

	static prepareEmail(emailtemplatename, argsreplacer) {
		let chosenEmailTemplate = template[emailtemplatename];
		if (chosenEmailTemplate) {
			let preparedEmail = chosenEmailTemplate.html
				.toString()
				.replace(`{{${chosenEmailTemplate.vars}}}`, argsreplacer);
			return { html: preparedEmail, subject: chosenEmailTemplate.subject };
		}
	}

	static createAndSendEmail(to, templateOccasion, argsreplacer,done) {
		let email_ready = this.prepareEmail(templateOccasion, argsreplacer);
		this.sendEmail(email_ready, to);
		done();
	}
}

// MailController.createAndSendEmail(
// 	"joanlamrack@gmail.com",
// 	"registered-manual",
// 	"Joanlmarack"
// );

module.exports = MailController;
