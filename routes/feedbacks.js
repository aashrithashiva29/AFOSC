var express 	= require("express");
var router  	= express.Router({mergeParams:true});
var Item	 	= require("../models/items");
var Feedback 	= require("../models/feedbacks");
var middleware	= require("../middleware");

//INDEX ROUTE
router.get("/",middleware.isLoggedIn, function(req,res){
	//console.log(req.user);
	Feedback.find({},function(err,allfeedbacks){
		if(err)
			console.log(err);
	 	else
	 		res.render("feedbacks/index",{feedbacks:allfeedbacks , currentUser: req.user});
	});
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to array
	var text	= req.body.text;
	var rating	= req.body.rating;
	var author 	= {
		id:req.user._id,
		username:req.user.username
	};
	var newFeedback={text:text,rating:rating,author:author};
	
	//create a new item and save to DB
	Feedback.create(newFeedback, function(err, newfeedback){
		if(err)
			console.log(err);
		else
			// redirect back to items page
			res.redirect("/items");
	});
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("feedbacks/new");
});


//EDIT ROUTE
router.get("/:id/edit",middleware.isLoggedIn,function(req,res){
	Feedback.findById(req.params.id, function(err,foundFeedback){
		res.render("feedbacks/edit",{feedback: foundFeedback});
	});
});

//UPDATE ROUTE
router.put("/:id",middleware.isLoggedIn,function(req,res){
	//find and update the correct feedback
	Feedback.findByIdAndUpdate(req.params.id,req.body.feedback,function(err,updatedFeedback){
		if(err)
			res.redirect("back");
		else
			//redirect to show page
			req.flash("success","Feedback updated!");
			res.redirect("/feedback");
	});
});

//DESTROY ROUTE
router.delete("/:id" ,middleware.isLoggedIn,function(req,res){
	Feedback.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("back");
		else{
			req.flash("success","Feedback deleted!");
			res.redirect("/feedback");
		}
	});
});
module.exports = router;
