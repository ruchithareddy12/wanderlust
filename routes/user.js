const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);
// router.post("/login", wrapAsync(userController.login));
router.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), userController.login);


router.get("/logout", userController.logout);

module.exports = router;

