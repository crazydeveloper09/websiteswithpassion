const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    profile: String,
    status:String,
    link: String,
    subpageLink: String,
    pictures: Array,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    added: Date,
    edited: Date,
    type: String,
	en: String,
	statusEn: String
});

module.exports = mongoose.model("Project", projectSchema);