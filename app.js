const session=require("express-session");
const express = require("express");
const app=express();
const cors = require("cors");
const port = process.env.PORT || 3000
const MongoClient = require('mongodb').MongoClient;
const base = "base";
const user="mi-diorama-virtual";
const password="nuestroproyecto1052";
const url = "mongodb+srv://"+user+":"+password+"@cluster0.s9ejk.mongodb.net/"+base+"?retryWrites=true&w=majority";

app.use(session({
  secret:process.env.SESSION_SECRET || 'some-secret',
  reseve: true,
  saveUninitialized: true
}));

app.use(cors());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/login.html");
    //res.send("hola");
});
app.post("/login",(req,res)=>{
  var correo = req.param('correo');
  var password = req.param('password');
  //console.log(correo);
  ress=res;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var query = { correo: correo, password: password };
    dbo.collection("usuario").find(query).toArray(function(err, result) {
      if (err){throw err; ress.send("0");}
      result.forEach(element=>{
        console.log(element.nombre)
        var auth = function(req, res, next) {
          if (req.session && req.session.user === element.nombre && req.session.admin)
            return next();
          else
            return res.sendStatus(401);
        };
        req.session.user=element.nombre;
        req.session.genero=element.genero;
        req.session.foto=element.foto;
      });
      //app.locals.datosUsuario=result;
      ress.send("1");
      db.close();
    });
  });
});

app.post("/datos",(req,res)=>{
  res.send('[{"nombre": "'+req.session.user+'","genero": "'+req.session.genero+'","foto": "'+req.session.foto+'"}]') ;
});
app.get("/cerrarsession",(req,res)=>{
  req.session.destroy();
  console.log("sesion cerrada");
});
app.post("/datosUsuario",(req,res)=>{
  res.send(app.locals.datosUsuario)
});
app.get("/archivoRegistro",(req,res)=>{
  res.sendFile(__dirname+"/registroUsuario.html");
});

app.get("/home",(req,res)=>{
  res.sendFile(__dirname+"/homeJuego.html");
});

app.post("/registrar",(req,res)=>{
  var nombre = req.param('nombre');
  var correo = req.param('correo');
  var password = req.param('password');
  var genero = req.param('genero');
  var fechaCreacion = req.param('fecha_creacion');
  //var idUsuario=
  ress=res;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { nombre: nombre, correo: correo, password: password, genero: genero, fecha_creacion: fechaCreacion };
    dbo.collection("usuario").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      ress.send("1");
      db.close();
    });
  });

});
app.listen(port,()=>{console.log("se inicio el servidor");});