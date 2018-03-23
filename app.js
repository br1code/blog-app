var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    Blog = require("./models/blogModel.js");

var app = express();

const port = process.env.PORT || 3000;

// APP CONFIG

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); // only after bodyParser
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/blog_app");


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
        body: req.sanitize(req.body.blog.body)
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
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

// UPDATE
app.put("/blogs/:id", (req, res) => {
    // remove any script tag of the body of the blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

// DESTROY
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        res.redirect("/blogs");
    });
});

// listening
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});