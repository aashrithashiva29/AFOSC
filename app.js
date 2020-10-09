//require npm modules
let express			= require("express"),
	app				= express(),
	bodyParser		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"), 
	methodOverride	= require("method-override"),
	LocalStrategy	= require("passport-local"),
	Feedback 		= require("./models/feedbacks"),
	User			= require("./models/user"),
	Item			= require("./models/items"),
	flash			= require("connect-flash");

var session 		= require('express-session');
var MongoStore		= require('connect-mongo')(session);

	
//require routes
let indexRoutes		= require("./routes/index"),
	itemRoutes		= require("./routes/items"),
	cartRoutes		= require("./routes/cart"),
	feedbackRoutes	= require("./routes/feedbacks"),
	checkoutRoutes	= require("./routes/checkout"),
	orderRoutes		= require("./routes/orders");

 
//require body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

//serving static assets
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.locals.moment=require('moment');

//set ejs to embed html in js
app.set("view engine","ejs");

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

app.use(function(req,res,next){
	res.locals.currentUser  = req.user;
	res.locals.session		= req.session;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});


//CONNECTION TO DB
mongoose.connect("mongodb+srv://aash:aash2906%23@cluster0-kmqxp.mongodb.net/clgProj?retryWrites=true&w=majority",{
	useNewUrlParser :true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
}).then(()=>{
	console.log("connected to db");
}).catch(err =>{
	console.log("error",err.message);
});

app.use(session({
	secret: 'mysupersecret',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection : mongoose.connection }),
	cookie:{maxAge: 180*60*1000 }
}))


app.use("/",indexRoutes);
app.use("/items",itemRoutes);
app.use("/cart",cartRoutes);
app.use("/feedback",feedbackRoutes);
app.use("/checkout",checkoutRoutes);
app.use("/orders",orderRoutes);

//listen on port 3000 if no env var
app.listen(process.env.PORT || 3000 , process.env.IP , function(){
	console.log("Server has started");
});
