var express 	= require("express");
var router  	= express.Router({mergeParams:true});
var middleware	= require("../middleware");
var Cart		= require("../models/cart");
var Order       = require("../models/checkout");

//INDEX ROUTE
router.get("/", function(req,res,next){
	if(!req.session.cart){
		return res.render("cart/pay",{products:null});
	}
	var cart = new Cart(req.session.cart);
	var arr = Object.values(cart.items);
	res.render("cart/pay",{items:arr,totalPrice:cart.totalPrice});
});

router.post("/",function(req,res){
    var cart = new Cart(req.session.cart);
    var arr = Object.values(cart.items);
    console.log(arr)
    let items=[]
    for(i of arr){
        items.push(i.item.name)
    }
    console.log(items)
    // get data from form to post
    Date.prototype.toShortFormat = function() {

        let monthNames =["Jan","Feb","Mar","Apr",
                          "May","Jun","Jul","Aug",
                          "Sep", "Oct","Nov","Dec"];
        
        let day = this.getDate();
        
        let monthIndex = this.getMonth();
        let monthName = monthNames[monthIndex];
        
        let year = this.getFullYear();
        
        return `${day}-${monthName}-${year}`;  
    }
    
    var date= new Date().toShortFormat()
    console.log(date)
    
	var newOrder={
        blockToDeliver:req.body.blockToDeliver,
        cardName:req.body.cardName,
        cardNumber:req.body.cardNumber,
        cvv:req.body.cvv,
        expireMonth:req.body.expireMonth,
        expireYear:req.body.expireYear,
        items:items,
        createdAt:date,
        author : {
            id:req.user._id,
            username:req.user.username
        },
        price:cart.totalPrice

    };

    // Order.create(newOrder, function(err){
	// 	if(err)
	// 		console.log(err);
	// 	else{
    //         req.session.cart=null
    //         // redirect to track page
	// 		res.redirect("/items");
    //     }
			
	// });

    
	
});

module.exports = router;