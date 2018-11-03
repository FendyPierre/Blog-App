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
    console.log(blog);
    Blog.create(blog, function(err, newBlog){
        if(err){
            res.render("new");
            console.log("failed to create new blog");
        }
        else{
            res.redirect("/blogs");
        }
    });
}

function findBlog(id,res){
    Blog.findById(id, function(err, foundBlog){
        mongoose.Types.ObjectId.isValid(id) ? console.log("Id is valid") : console.log("ID is not valid");
        if(!err){
            res.render("show", {blog: foundBlog});
            console.log(foundBlog);
        }
        else{
            console.log("failed to find blog" + err);
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
    console.log(req.body);
    blog = req.body.blog;
    createBlog(blog,res);
});

//Show Route
app.get("/blogs/:id",function (req,res) {
    var id = req.params.id;
    console.log(id);
    findBlog(id,res);
  })

app.listen(3000, function(){
    console.log("Server is running!");
});