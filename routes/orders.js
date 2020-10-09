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



module.exports = router;