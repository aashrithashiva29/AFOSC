var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user"),
	Item = require("../models/items"),
	Order = require("../models/checkout"),
	middleware = require("../middleware");
//============
//INDEX ROUTES
//============
router.get("/", function (req, res) {
	res.render("home");



});

//==============
//AUTH ROUTES
//==============
router.get("/register", function (req, res) {
	res.render("register");
});


router.post("/register", function (req, res) {
	// console.log(req.body.typeOfUser);
	var newUser = new User({
		userid: req.body.userid,
		username: req.body.username,
		email: req.body.email,
		mobile: req.body.mobileno,
		avatar: "http://www.cityinvesto.com/wp-content/uploads/2019/12/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg",
		typeOfUser: req.body.typeOfUser
	});
	//eval(require('locus'));
	// if (req.body.adminCode === 'admincode') {
	// 	newUser.isAdmin = true;
	// }
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome " + user.username);
			res.redirect("/items");
		});
	});
});

//=============
//LOGIN ROUTES
//=============
router.get("/login", function (req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/items",
	failureRedirect: "/login",
	successFlash: "Welcome !!"
}), function (req, res) {
	//req.flash("success","Successfully Logged In!!");
});

//==============
//LOGOUT ROUTES
//==============
router.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Successfully Logged Out!");
	res.redirect("/");
});

//USER PROFILE
router.get("/users/:id", middleware.isLoggedIn, function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err) {
			req.flash("error", "Something went wrong !");
			res.redirect("/");
		}
		Order.find().where('author.id').equals(foundUser._id).exec(function (err, orders) {
			if (err) {
				req.flash("error", "Something went wrong !");
				res.redirect("/");
			}
			// console.log(orders[0].items);
			res.render("users/show", { user: foundUser, orders: orders });
		});
	});
});

module.exports = router;