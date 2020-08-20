const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const date=require(__dirname+"/date.js")
const mongoose=require("mongoose");//1stMangoose: To use mangoose after install int npm i mongoose
const e = require("express");

// mongoose.connect('mongodb://localhost:27017/ToDoListDB', {useUnifiedTopology: true,useNewUrlParser: true});//2ndMongoose:This is the minimum needed to connect the ToDoListDB database running locally on the default port (27017)

// Data base connection insted of the local connection 

const app=express();
app.set("view engine", "ejs");//This line of code should follow " const app=express();"
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
// 3rdMongoose : create new schema 
const itemsShema ={
    Name:String,
}; 

const listSchema={
    Name: String,
    Maintitle:String,
    Subtilte:String,
    Paragraphs:[]
}
// 4thMongoose: create mongoose.mode  note: item should be singular and mongoose autumatically will make it plural 
// Const item = mongoose.model("SingularCollectionName", schema name);
const Item = mongoose.model("Item", itemsShema);
const List = mongoose.model("List",listSchema);
var items =[]
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var d = new Date();
var day=days[d.getDay()];

const item1 = new Item({
    Name: "Add To-Do:",
    Maintitle:"firt sub",
    Subtilte:"second sub",
    Paragraphs:["Parg1"]
});

defultList=[item1]

app.get("/",function(req,res){
    List.find(function(err,allItems){
        if(!err){
            if(allItems){
            // software engineer 
            allItems.map(item => {
                if (item.Name === "Software Engineer"){
                    app.locals.SEitem=item
                }else// rboo 
                if (item.Name === "Rboo"){
                    app.locals.Rbooitem=item
                }else // kbr 
                if (item.Name === "Kbr Kellogg Brown & Root"){
                    app.locals.Kbritem=item
                }else // Advance Software Engineering agile
                if (item.Name === "Advance Software Engineering"){
                    app.locals.Agileitem=item
                }else // advvance database azure
                if (item.Name === "Advance Database"){
                    app.locals.Azureitem=item
                }else // aws
                if (item.Name === "Cloud Computing | Spring 2020"){
                    app.locals.Awsitem=item
                }else // web data mangment
                if (item.Name === "Web Data Mangment"){
                    app.locals.Wdmitem=item
                }

            });

            app.locals.myVar=allItems
            }else(
                console.log("items not found")
            )
        }else{
            console.log(err)
        }

        res.render("list");
    })
});



    

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){

    console.log("listening to port 3000 ...");

});



