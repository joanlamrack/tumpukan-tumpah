const router = require("express").Router();
const ThreadController = require("../controllers/threadController");
const AuthMiddleware = require("../middlewares/authMiddleware");

router
	.route("/")
	.get(ThreadController.getAllThreads) // get all threads
	.post(ThreadController.createThread); //create new thread

router.post(":/threadId/upvote", ThreadController.upvoteThreadById); // upvote a thread, make sure user is logged in and the thread has been not been voted?
router.post(":/threadId/downvote", ThreadController.downvoteThreadById); //downvote a thread

router
	.route("/:threadId")
	.get(ThreadController.getThreadByid) //get a thread with comments and user names
	.delete(ThreadController.deleteThreadById) // delete a thread (make sure it's user owned)
	.patch(ThreadController.patchThreadById); // patch/ update a thread (make sure it's user owned)

router.get("/me", ThreadController.getAllThreadsByUserId);

module.exports = router;
