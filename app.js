//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const { redirect } = require("express/lib/response");
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://venkatavarun:Varun9292@cluster0.wn86e.mongodb.net/todolistDB")
 const itemsSchema = new mongoose.Schema({
         activity:"String"
});
const Item = mongoose.model("Items",itemsSchema);
const Item1= new Item({
 activity:"Welcome to your todolist"
});
const Item2= new Item({
  activity:"Hit the + button to add a new Item."
 });
 const Item3= new Item({
  activity:"<-- Hit this to delete an item."
 })
 const defualtIteams=[Item1,Item2,Item3];

 const listSchema ={
   name:String,
   items :[itemsSchema]
 };

 const List =mongoose.model("Lists",listSchema);



app.get("/", function(req, res) {

  Item.find({},function(err,arr_Items)
  {
    if(arr_Items.length===0)
    {
      Item.insertMany(defualtIteams,function(err)
      {
           if(err)
           {
             console.log(err);
           }
           else{
             console.log("Compiled sucessfully");
           }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: arr_Items})
    }
  })
});


app.get("/:customListName",function(req,res)
{
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList)
  {
    if(!err)
    {
      if(!foundList)
      {
        const list=new List({
        name:customListName,
        items: defualtIteams
        });
        list.save(); 
     res. redirect("/"+customListName);
      }
      else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
    }

  })
  
})




app.post("/", function(req, res){
  const itemname = req.body.newItem;
  const listName=req.body.list;

  const item4= new Item({
    activity:itemname
   });
   if(listName=="Today")
   {
   item4.save();
  res. redirect("/");
   }
   else{
     List.findOne({name:listName},function(err,foundList){
       foundList.items.push(item4);
       foundList.save();
       res.redirect("/"+listName);

     })
   }
  
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today")
  {
  Item.findByIdAndRemove(checkedItemId,function(err)
  {
    if(!err)
    {
      console.log("Sucessufully deleted the checked item");
      res.redirect("/");
    }
  })
}
else
{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,custom_list)
  {
    if(!err)
    {
      res.redirect("/"+listName);
    }
  });
}
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
