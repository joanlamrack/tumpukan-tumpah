const router = require("express").Router();
const AuthMiddleware = require("../middlewares/authMiddleware");

router
	.route("/")
	.get(function(req, res) {}) // get all threads
	.post(function(req, res) {}); //create new thread

router.post(":/threadId/upvote", function(req, res) {}); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(":/threadId/downvote", function(req, res) {}); //downvote a thread

router
	.route("/:threadId")
	.get(function(req, res) {}) //get a thread with comments and user names
	.delete(function(req, res) {}) // delete a thread (make sure it's user owned)
	.patch(function(req, res) {}); // patch/ update a thread (make sure it's user owned)

router.get("/me", function(req, res) {});

exports.modules = router;
