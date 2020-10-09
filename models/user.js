var mongoose	= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	userid:String,
	username:String,
	password:String,
	// avatar:"http://www.cityinvesto.com/wp-content/uploads/2019/12/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg",
	avatar:String,
	mobile:Number,
	email: String,
	isAdmin: 
	{
		type: Boolean,
		default:false
	},
	typeOfUser:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);