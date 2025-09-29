const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};



module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    return res.redirect("/listings");
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};
