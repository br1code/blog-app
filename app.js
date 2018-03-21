var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");

var app = express();
const port = process.env.PORT || 3000;

// APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");



// MONGOOSE AND MODEL CONFIG

mongoose.connect("mongodb://localhost/blog_app");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

// INDEX
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE
app.post("/blogs", (req, res) => {
    Blog.create({
        title: req.body.blog.title,
        image: req.body.blog.image,
        description: req.body.blog.description,
        body: req.body.blog.body
    }, (err, blog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

// UPDATE
app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

// listening
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});