//App config
var  express        = require("express"),
     methodOverride = require("method-override"),
     mongoose       = require("mongoose")
     bodyParser     = require("body-parser"),
     path           = require("path"),
     app            = express();

     
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static('public'));  
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


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

function showBlog(id,res){
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

app.get("/blogs/:id",function (req,res) {
    var id = req.params.id;
    var page = "show";
    showBlog(id,res, page);
  })


  //Edit Route
function editBlog(id,res){
    Blog.findById(id, function(err, foundBlog){
        mongoose.Types.ObjectId.isValid(id) ? console.log("Id is valid") : console.log("ID is not valid");
        if(!err){
            res.render("edit", {blog: foundBlog});
            console.log(foundBlog);
        }
        else{
            console.log("failed to find blog" + err);
            res.redirect("/blogs");
        }
    });
}

  app.get("/blogs/:id/edit", function(req,res){
      var id = req.params.id;
      editBlog(id,res);
  });

app.listen(3000, function(){
    console.log("Server is running!");
});

//Update Route
app.put("/blogs/:id", function(req, res){
    var id = req.params.id
    var blog = req.body.blog;
    console.log();
    updateBlog(id, blog, res)
});


function updateBlog(id,blog, res){
    Blog.findByIdAndUpdate(id, blog, function(err, updatedBlog){
        var path = "/blogs/" + id;
        if(!err){
            res.redirect(path);
        }
        else{
            console.log("failed to update! ERROR: " + err);
        }
    });
}

//Delete Route

app.delete("/blogs/:id", function(req, res){
    var id = req.params.id;
    deleteBlog(id, res)
});

function deleteBlog(id, res){
    Blog.findByIdAndDelete(id, function (err, callback) {
        if(!err){
            res.redirect("/blogs");
            console.log("Successfully Delete!")
        }
        else{
            console.log("Failed to delete blog! Error: " + err);
        }
      });
}