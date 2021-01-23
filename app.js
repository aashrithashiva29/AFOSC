//require npm modules
let express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	flash = require("connect-flash");

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//require routes
let indexRoutes = require("./routes/index"),
	itemRoutes = require("./routes/items"),
	cartRoutes = require("./routes/cart"),
	feedbackRoutes = require("./routes/feedbacks"),
	checkoutRoutes = require("./routes/checkout"),
	orderRoutes = require("./routes/orders");


//require body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

//stripe api key SK_
const stripe = require('stripe')('sk_test_51H7gTXJPyl22FwkuMII2d29sIG6j8f8WOtlFCrtieze4ULa3VvMva255H7nZc9JwaT48gZREhfJte6F0ZPibQYTp004cq9HoXW');

//serving static assets
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');

//set ejs to embed html in js
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION
// implement sessions
app.use(require("express-session")({
	//object -secretkey,default save values of session
	secret: "It is to be kept secret", //to encode n decode session
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//reading the session 
//taking the data from session 
//encoding and unencoding it
//these two methods are predefined in passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	// res.locals.currentUserEmail= req.email;
	res.locals.session = req.session;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//CONNECTION TO DB
mongoose.connect("mongodb+srv://aash:aash2906%23@cluster0-kmqxp.mongodb.net/clgProj?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(() => {
	console.log("connected to db");
}).catch(err => {
	console.log("error", err.message);
});

app.use(session({
	secret: 'mysupersecret',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: { maxAge: 180 * 60 * 1000 }
}))


//stripe create customer
// createCustomer();
app.post("/charge", (req, res) => {
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
							line1: '510 Townsend St',
							postal_code: '500059',
							city: 'HYDERABAD',
							state: 'AP',
							country: 'IN',
						},
					},
				})
			)
			.then(() => res.render("completed.html"))
			.catch(err => console.log(err));
	} catch (err) {
		res.send(err);
	}
});

app.use("/", indexRoutes);
app.use("/items", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);

//listen on port 3000 if no env var
app.listen(process.env.PORT || 3000, process.env.IP, function () {
	console.log("Server has started");
});

