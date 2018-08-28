const router = require("express").Router();
const AuthMiddleware = require("../middlewares/authMiddleware");

//Comments

router.route("/").post(function(req, res) {}); // create Comment with threadId on headers, and user token

router.post(":/commentId/upvote", function(req, res) {}); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(":/commentId/downvote", function(req, res) {}); //downvote a thread

router
	.route("/:commentId")
	.get(function(req, res) {}) // get comment
	.patch(function(req, res) {}); // edit comment with user token

router.get("/me", function(req, res) {});



module.exports = router;
