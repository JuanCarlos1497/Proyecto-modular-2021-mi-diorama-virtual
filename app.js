const express = require("express");
const app=express();
const cors = require("cors");
const port = process.env.PORT || 3000
const MongoClient = require('mongodb').MongoClient;
const base = "base";
const user="mi-diorama-virtual";
const password="nuestroproyecto1052";
const url = "mongodb+srv://"+user+":"+password+"@cluster0.s9ejk.mongodb.net/"+base+"?retryWrites=true&w=majority";

/*MongoClient.connect(url, function(err, db){
    if (err) throw err;
    var dbo = db.db("base");
    dbo.collection("documento").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log("se conecto");
      db.close();
    });
});*/
app.use(cors());
app.get("/",(req,res)=>{
    //res.sendFile(__dirname+"/login.html");
    res.send("hola");
});
app.post("/login",(req,res)=>{
  var correo = req.param('correo');
  var password = req.param('password');
  console.log(correo);

})
app.listen(port,()=>{console.log("se inicio el servidor");});