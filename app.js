var  express    = require("express"),
     mongoose   = require("mongoose")
     bodyParser  = require("body-parser")
     app        = express();

mongoose.connect("mongodb://localhost/blogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(){
    console.log("Server is running!");
});