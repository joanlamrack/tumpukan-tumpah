const router = require("express").Router();
const CommentController = require("../controllers/commentController");
const AuthMiddleware = require("../middlewares/authMiddleware");

//Comments

router.route("/").post(CommentController.createComment); // create Comment with threadId on headers, and user token

router.post(":/commentId/upvote", CommentController.upvoteCommentById); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(":/commentId/downvote", CommentController.downvoteCommentById); //downvote a thread

router
	.route("/:commentId")
	.get(CommentController.getCommentById) // get comment
	.patch(CommentController.patchCommentById); // edit comment with user token

router.get("/me", CommentController.getCommentByUserId);

module.exports = router;
