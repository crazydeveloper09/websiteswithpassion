const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    whatYouWish: String,
    status: String,
    statusEn: String,
    previousWebsite: String,
    type: String,
    websiteTitle: String,
    orderDate: {
        type: Date,
        default: Date.now()
    },
    budget: Number
});

module.exports = mongoose.model("Order", orderSchema)