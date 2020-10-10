var express			= require("express"),
	router			= express.Router(),
	Order			= require("../models/checkout"),
	middleware 		= require("../middleware");

router.get("/", function (req, res, next) {
	if(req.user.isAdmin){
		Order.find({}, function (err, allOrders) {
			if (err)
				console.log(err);
			else
				res.render("orders/index", { orders: allOrders, currentUser: req.user });
		});
	}
	else{
		Order.find({'author.id':req.user._id}, function (err, allOrders) {
			if (err)
				console.log(err);
			else
				res.render("orders/index", { orders: allOrders, currentUser: req.user });
		});
	}
	
});

router.get("/:id",async function(req,res){
	try{
		let order =await Order.findById(req.params.id)
		// console.log(order);
    	if(req.user._id.toString() === order.author.id.toString()){
        	res.render("cart/trackPage",{order:order});
    	}
    	res.redirect("/items");
	}
	catch(e){
		
	}
	
});

router.get("/:id/dispatched", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "dispatched" }).exec();
	req.flash("success", "Order status updated!");
	res.redirect('back');

});

router.get("/:id/reached", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "reached" }).exec();
	req.flash("success", "Order status updated!");
	res.redirect('back');
});

router.get("/:id/delivered", function (req, res) {
	Order.where({ _id: req.params.id }).updateOne({ status: "delivered" }).exec();
	req.flash("success", "Order status updated!");
	res.redirect('back');
});



module.exports = router;