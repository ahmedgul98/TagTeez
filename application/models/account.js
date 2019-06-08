var mongoose = require("mongoose");

var AccSchema = new mongoose.Schema({
    email: String,
    typ: String,
    a_user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
    
});



module.exports = mongoose.model("Account", AccSchema);
