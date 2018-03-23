const mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    body: String,
    created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
