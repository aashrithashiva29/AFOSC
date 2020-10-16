var express = require("express"),
	router = express.Router(),
	Order = require("../models/checkout"),
	middleware = require("../middleware");
var fast2sms = require("fast-two-sms");

var api = 'C24tnUhjNGYiWxkQmHpSRFgfluJszZ83OoDATv0VPwLI7Mb91KqK0ubBCLZOhr9Ps8XQWfgIedDEiGt1';


router.get("/", function (req, res, next) {
	if (req.user.isAdmin) {
		Order.find({}, function (err, allOrders) {
			if (err)
				console.log(err);
			else
				res.render("orders/index", { orders: allOrders, currentUser: req.user });
		});
	}
	else {
		Order.find({ 'author.id': req.user._id }, function (err, allOrders) {
			if (err)
				console.log(err);
			else
				res.render("orders/index", { orders: allOrders, currentUser: req.user });
		});
	}

});

router.get("/:id", async function (req, res) {
	try {
		let order = await Order.findById(req.params.id)
		// console.log(order);
		if (req.user._id.toString() === order.author.id.toString()) {
			res.render("cart/trackPage", { order: order });
		}
		res.redirect("/items");
	}
	catch (e) {

	}

});

router.get("/:id/dispatched", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "dispatched" }).exec();
	var options = { authorization: api, message: 'Holla amigo! Order dispatched to your destination. It will reach you by time. check your status here brewhub.com', numbers: [req.user.mobile] };
	fast2sms.sendMessage(options)
	console.log(options)
	req.flash("success", "Order status updated!");
	res.redirect('back');

});

router.get("/:id/reached", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "reached" }).exec();
	var options = { authorization: api, message: 'Holla amigo! Reached: Order reached to your destination. It will reach you by time. check your status here brewhub.com', numbers: [req.user.mobile] };
	fast2sms.sendMessage(options)
	console.log(options)
	req.flash("success", "Order status updated!");
	res.redirect('back');
});

router.get("/:id/delivered", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "delivered" }).exec();
	var options = { authorization: api, message: 'Holla amigo! Delivered: Order has been delivered. Enjoy the food and gives us feedback.', numbers: [req.user.mobile] };
	fast2sms.sendMessage(options)
	console.log(options)
	req.flash("success", "Order status updated!");
	res.redirect('back');
});

router.get("/:id/cancel", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "cancelled" }).exec();
	var options = { authorization: api, message: 'Holla amigo! cancelled: Your order has beed cancelled. Feel free to gives us feedback.', numbers: [req.user.mobile] };
	fast2sms.sendMessage(options)
	req.flash("success", "order has been cancelled");
	res.redirect('back');
})



module.exports = router;