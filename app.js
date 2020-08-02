const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const date=require(__dirname+"/date.js")
const mongoose=require("mongoose");//1stMangoose: To use mangoose after install int npm i mongoose

// mongoose.connect('mongodb://localhost:27017/ToDoListDB', {useUnifiedTopology: true,useNewUrlParser: true});//2ndMongoose:This is the minimum needed to connect the ToDoListDB database running locally on the default port (27017)

mongoose.connect('mongodb+srv://admin-mustafa:Qwer2468@cluster0.feuuv.mongodb.net/ToDoListDB', {useUnifiedTopology: true,useNewUrlParser: true});

const app=express();

app.set("view engine", "ejs");//This line of code should follow " const app=express();"

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// 3rdMongoose : create new schema 
const itemsShema ={
    Name:String
}; 

const listSchema={
    Name:String,
    Itemlist:[itemsShema]
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
    Name: "Add To-Do:"
});

defultList=[item1]

app.get("/",function(req,res){
    Item.find(function(err,itemsFromDb){
        if (itemsFromDb.length===0){
            Item.insertMany([item1],function(err){
                if (err){
                    console.log(err)
                }else{
                    console.log("Items has been added successfully")
                }
                res.redirect("/");
            });
            
        }else{
            res.render("list",{title:day, items:itemsFromDb});
        }
    });
    // Or we can use the other funciton inside our modual app.js "day" 
    // By adding it like:  var Day_value =date.Day();
});

// Every time create new list 
app.get("/:next",function(req,res){

    // Make only first letter uppercase
    // We can use Lodash(https://lodash.com/), but because it is pacage needs install and sometime cause issues 
    const nextpageLowerCase=(req.params.next).toLocaleLowerCase();
    const nextpage = nextpageLowerCase.charAt(0).toUpperCase() + nextpageLowerCase.slice(1);

    // Find if the list in the collections Lists
    List.findOne({Name:nextpage},function(err,returnedList){
        if(err){
            console.log(err);
        }else{
            if (!returnedList){
                // Create new List if not exist
                const onelist = new List({
                    Name:nextpage,
                    Itemlist:defultList
                });
                onelist.save();
                res.redirect("/"+nextpage)
            }
            // If it is List exist already just direct to it
            else{
                res.render("list",{items:returnedList.Itemlist,title:returnedList.Name});
            }
        }
    })

});
//Get post req from list.ejs file
app.post("/",function(req,res){
    
    const title1=req.body.button
    const todoitem=req.body.todoitem 
    //Create new item and pass the ToDo in it as name
    const newitem = new Item({
        Name: todoitem
    });

   if (title1 === day){
        newitem.save();
        res.redirect("/");
   }else{
       List.findOne({Name:title1},function(err,founditem){
           founditem.Itemlist.push(newitem);
           founditem.save();
           res.redirect("/"+title1);
       });
   }

});

//To delete item from any list
app.post("/Delete",function(req,res){

    const itemId = req.body.mycheckbox
    const listName=req.body.checkbox2
    // If this is the main list the day list
    if (listName === day){
        Item.deleteOne({_id:itemId},function(err){
            if (err){
                console.log(err);
            }else{
                console.log("deleted successfully");
            }
            res.redirect("/")
        });
    }else{
        // If another list find the other list and 
        List.findOne({Name:listName},function(err,returnedList){
        if(err){
            console.log(err);
        }else{
            // I used this format wich is compination between mongoose(<Model Name>.findOneAndUpdate), and mongoDB (pull)
            // <Model Name>.findOneAndUpdate({conditions},{$pull:{field:{_id:value}},fucntion(err,results){});

            List.findOneAndUpdate({Name:listName },{ $pull: { Itemlist: {_id:itemId}} },function(err,result){
                if (err){
                    console.log(err)
                }else{
                    console.log("deleted successfully")
                }
                res.redirect("/"+listName)

            });


        }
        
    });

    };

});





app.listen(3000,function(){

    console.log("listening to port 3000 ...");

});



