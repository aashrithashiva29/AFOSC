var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var OrderSchema = new mongoose.Schema({
  blockToDeliver: String,
  cardName: String,
  cardNumber: Number,
  cvv: Number,
  expireMonth: Number,
  expireYear: Number,
  items: Object,
  status: String, 
  orderId: Number,
  createdAt: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  price: Number
});

OrderSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Order", OrderSchema);