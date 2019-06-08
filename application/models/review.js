var mongoose=require("mongoose");
var reviewSchema =new mongoose.Schema({
    text:String,
     r_acc: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
});
module.exports = mongoose.model("review", reviewSchema);