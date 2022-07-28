const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  
    title: String,
    titleEn: String,
    color: String,
    link: String,
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
})

module.exports = mongoose.model("Category", categorySchema);
