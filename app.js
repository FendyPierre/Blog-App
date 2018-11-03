//App config
var  express    = require("express"),
     mongoose   = require("mongoose")
     bodyParser  = require("body-parser")
     app        = express();

     
mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//Mongoose Model Config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL Routes

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





app.listen(3000, function(){
    console.log("Server is running!");
});