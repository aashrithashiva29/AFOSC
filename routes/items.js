var express 	= require("express");
var router  	= express.Router();
var Item	 	= require("../models/items");
var middleware	= require("../middleware");

//INDEX ROUTE
router.get("/",middleware.isLoggedIn,function(req,res){
	//console.log(req.user);
	Item.find({},function(err,allitems){
		if(err)
			console.log(err);
	 	else
	 		res.render("items/index",{items:allitems , currentUser: req.user});
	});
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
//	console.log(req.body);
//	console.log(req.user);
	//get data from form and add to array
	var name=req.body.name;
	var price=req.body.price;
	var img=req.body.image;
	var desc = req.body.description;
	var itemtype = req.body.typeOfItem;
	var author = {
		id:req.user._id,
		username:req.user.username
	};
	var newItem={name:name,price:price,image:img,description:desc,typeOfItem:itemtype,author:author};
	
	//create a new item and save to DB
	Item.create(newItem, function(err){
		if(err)
			console.log(err);
		else
			// redirect back to campgrounds
			res.redirect("/items");
	});
});

//NEW ROUTE
router.get("/new" ,middleware.isLoggedIn, function(req,res){
	res.render("items/new");
});

//EDIT ROUTE
router.get("/:id/edit",middleware.isLoggedIn, function(req,res){
	Item.findById(req.params.id, function(err,foundItem){
		res.render("items/edit",{item: foundItem});
	});
});

//UPDATE ROUTE
router.put("/:id",middleware.isLoggedIn,function(req,res){
	//find and update the correct item
	Item.findByIdAndUpdate(req.params.id,req.body.item,function(err,updatedItem){
		if(err)
			res.redirect("back");
		else
			//redirect to show page
			req.flash("success","Item updated!");
			res.redirect("/items");
	});
});

//DESTROY ROUTE
router.delete("/:id",middleware.isLoggedIn,function(req,res){
	Item.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/items");
		else
			req.flash("success","Item deleted!");
			res.redirect("/items");
	});
});



module.exports = router;