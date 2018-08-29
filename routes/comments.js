const router = require("express").Router();
const CommentController = require("../controllers/commentController");
const AuthMiddleware = require("../middlewares/authMiddleware");

//Comments

router
	.route("/")
	.post(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		CommentController.createComment
	); // create Comment with threadId on headers, and user token

router.get(
	"/me",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	CommentController.getCommentByUserId
);

router.post(
	"/:commentId/upvote",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	AuthMiddleware.isNotOwnedByUser,
	CommentController.upvoteCommentById
); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(
	"/:commentId/downvote",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	AuthMiddleware.isNotOwnedByUser,
	CommentController.downvoteCommentById
); //downvote a thread

router
	.route("/:commentId")
	.get(CommentController.getCommentById) // get comment
	.patch(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.isOwnedByUser,
		CommentController.patchCommentById
	) // edit comment with user token
	.delete(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.isOwnedByUser,
		CommentController.deleteCommentById
	);

module.exports = router;
