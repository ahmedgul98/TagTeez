var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    message: String
});


module.exports = mongoose.model("chat", UserSchema);