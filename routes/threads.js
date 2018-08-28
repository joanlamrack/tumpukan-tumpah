const router = require("express").Router();
const ThreadController = require("../controllers/threadController");
const AuthMiddleware = require("../middlewares/authMiddleware");

router
	.route("/")
	.get(ThreadController.getAllThreads) // get all threads
	.post(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		ThreadController.createThread
	); //create new thread

router.get(
	"/me",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	ThreadController.getAllThreadsByUserId
);

router
	.route("/:threadId")
	.get(ThreadController.getThreadByid) //get a thread with comments and user names
	.delete(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.isOwnedByUser,
		ThreadController.deleteThreadById
	) // delete a thread (make sure it's user owned)
	.patch(
		AuthMiddleware.checkifTokenExist,
		AuthMiddleware.checkifTokenValid,
		AuthMiddleware.isOwnedByUser,
		ThreadController.patchThreadById
	); // patch/ update a thread (make sure it's user owned)

router.post(
	"/:threadId/upvote",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	AuthMiddleware.isNotOwnedByUser,
	ThreadController.upvoteThreadById
); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(
	":/threadId/downvote",
	AuthMiddleware.checkifTokenExist,
	AuthMiddleware.checkifTokenValid,
	AuthMiddleware.isNotOwnedByUser,
	ThreadController.downvoteThreadById
); //downvote a thread

module.exports = router;
