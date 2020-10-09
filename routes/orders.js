var express		= require("express"),
	router  	= express.Router(),
    Order      = require("../models/checkout"),
	middleware	= require("../middleware");

router.get("/", function(req,res,next){
    Order.find({},function(err,allOrders){
		if(err)
			console.log(err);
	 	else
	 		res.render("orders/index",{orders:allOrders , currentUser: req.user});
	});
	
});

router.get("/:id/dispatched",function(req,res){
	Order.where({_id:req.params.id}).updateOne({status:"dispatched"}).exec();
	req.flash("success","Order status updated!");
	res.redirect('back');

});

router.get("/:id/reached",function(req,res){
	Order.where({_id:req.params.id}).updateOne({status:"reached"}).exec();
	req.flash("success","Order status updated!");
	res.redirect('back');
});

router.get("/:id/delivered",function(req,res){
	Order.where({_id:req.params.id}).updateOne({status:"delivered"}).exec();
	req.flash("success","Order status updated!");
	res.redirect('back');
});


module.exports = router;