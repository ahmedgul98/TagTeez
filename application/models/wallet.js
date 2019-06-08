var mongoose = require("mongoose");

var walletSchema = new mongoose.Schema({
    amount: Number,
    w_acc: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "account"
        }
    ]
});


module.exports = mongoose.model("Wallet", walletSchema);
