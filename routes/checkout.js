var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middleware");
var Cart = require("../models/cart");
var Order = require("../models/checkout");
const stripe = require('stripe')('sk_test_51H7gTXJPyl22FwkuMII2d29sIG6j8f8WOtlFCrtieze4ULa3VvMva255H7nZc9JwaT48gZREhfJte6F0ZPibQYTp004cq9HoXW');
var fast2sms = require("fast-two-sms");
var api = '5roiNDGfSzqtpuAMuiSvn14yTkNZL0NXePRw2tiZTUVgOohPrwNWBCRI8QcI';


//INDEX ROUTE
router.get("/", middleware.isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.render("cart/pay", { products: null });
    }
    var cart = new Cart(req.session.cart);
    var arr = Object.values(cart.items);
    res.render("cart/pay", { items: arr, totalPrice: cart.totalPrice });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var cart = new Cart(req.session.cart);
    var arr = Object.values(cart.items);
    // console.log(arr)
    let items = []
    for (i of arr) {
        let p = {
            name: i.item.name,
            price: i.price,
            quantity: i.quantity
        }
        items.push(p)
    }
    // console.log(items)
    // get data from form to post
    Date.prototype.toShortFormat = function () {

        let monthNames = ["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"];

        let day = this.getDate();
        let monthIndex = this.getMonth();
        let monthName = monthNames[monthIndex];
        let year = this.getFullYear();

        return `${day}-${monthName}-${year}`;
    }

    var date = new Date().toShortFormat()
    console.log(date)
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    currency: "INR",
                    customer: customer.id,
                    description: 'food order',
                    shipping: {
                        name: req.body.name,
                        address: {
                            line1: req.body.blockToDeliver,
                            postal_code: '500059',
                            city: 'HYDERABAD',
                            state: 'TS',
                            country: 'IN',
                        },
                    },
                })
            )
            .then(() => {
                var rand = Math.floor(Math.random() * Math.floor(5000));
                var options = { authorization: api, message: 'Holla amigo! Order placed. Your Order Id is '+rand+'. Stay on hold!', numbers: [req.user.mobile] };
                fast2sms.sendMessage(options)
                // console.log(options)
                var newOrder = {
                    blockToDeliver: req.body.blockToDeliver,
                    items: items,
                    status: "ordered",
                    orderId: rand,
                    createdAt: date,
                    author: {
                        id: req.user._id,
                        username: req.user.username
                    },
                    price: cart.totalPrice
                };

                Order.create(newOrder, function (err) {
                    if (err)
                        console.log(err);
                    else {

                        req.session.cart = null
                        // redirect to track page
                        res.redirect("/items");
                    }

                });
            })
            .catch(err => console.log(err));
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;




