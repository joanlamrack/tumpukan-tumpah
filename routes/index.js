const router = require("express").Router();
const threadRoute = require("./threads.js");
const commentRoute = require("./comments.js");
const UserController = require("../controllers/userControllers");

router.use("/threads", threadRoute);
router.use("/comments", commentRoute);

router.get("/", function(req, res) {
	res.send("Well This works");
});

router.post("/register", UserController.signup);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleSignUp);
router.post("/forgotpassword", UserController.forgotPassword);

module.exports = router;