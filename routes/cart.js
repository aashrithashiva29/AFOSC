var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user"),
	Item = require("../models/items"),
	Cart = require("../models/cart"),
	middleware = require("../middleware");

// VIEW CART
router.get("/", middleware.isLoggedIn, function (req, res, next) {
	if (!req.session.cart) {
		return res.render("cart/index", { products: null });
	}
	var cart = new Cart(req.session.cart);
	var arr = Object.values(cart.items);
	res.render("cart/index", { items: arr, totalPrice: cart.totalPrice });
});

// ADD TO CART
router.get("/add-to-cart/:id",middleware.isLoggedIn, function (req, res, next) {
	var itemId = req.params.id;
	//console.log(itemId);
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	Item.findById(itemId, function (err, item) {
		if (err) {
			return res.redirect("/items");
		}
		cart.add(item, item.id);
		req.session.cart = cart;
		//console.log(req.session.cart);
		res.redirect("back");
	})
});

// REMOVE FROM CART
router.get("/remove-from-cart/:id",middleware.isLoggedIn, function (req, res, next) {
	var itemId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	Item.findById(itemId, function (err, item) {
		if (err) {
			return res.redirect("/items");
		}
		console.log(req.session.cart)
		cart.remove(item.id);
		req.session.cart = cart;
		console.log(req.session.cart)
		//console.log(req.session.cart);
		res.redirect("back");
	})
});

module.exports = router;