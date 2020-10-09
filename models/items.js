var mongoose	= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var ItemSchema = new mongoose.Schema({
	name : String,
	price: Number,
	image: String,
	description : String,
	typeOfItem:String,
	createdAt: {type:Date,default:Date.now},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
});

ItemSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Item",ItemSchema);