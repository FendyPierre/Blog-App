//App config
var  express     = require("express"),
     mongoose    = require("mongoose")
     bodyParser  = require("body-parser"),
     path        = require("path"),
     app         = express();

     
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static('public'));  
app.use(bodyParser.urlencoded({extended: true}));


//Mongoose Model Config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

function createBlog(blog, res){
    Blog.create(blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
}


//RESTFUL Routes

//Index Route
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Failed to find blogs. ERROR:" + err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });

});

app.get("/", function(req,res){
    res.redirect("/blogs");
});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//Create Route
app.post("/blogs", function(req,res){
    blog = req.body.blog;
    createBlog(blog,res);
});

app.listen(3000, function(){
    console.log("Server is running!");
});