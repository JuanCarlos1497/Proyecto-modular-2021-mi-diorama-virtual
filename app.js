const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000
const MongoClient = require('mongodb').MongoClient;
const base = "base";
const user = "mi-diorama-virtual";
const password = "nuestroproyecto1052";
const url = "mongodb+srv://" + user + ":" + password + "@cluster0.s9ejk.mongodb.net/" + base + "?retryWrites=true&w=majority";

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.post("/login", (req, res) => {
  var correo = req.param('correo');
  var password = req.param('password');
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var llave = CryptoJS.AES.encrypt(password, correo).toString();
    var query = { correo: correo };
    dbo.collection("usuario").find(query).toArray(function (err, resulto) {
      if (err) { throw err; }
      resulto.forEach(element => {
        console.log(element.nombre)
        var bytes = CryptoJS.AES.decrypt(element.password, correo);
        var llaveOriginal = bytes.toString(CryptoJS.enc.Utf8);
        if (password === llaveOriginal) {
          dbo.collection("private").findOne({}, function (err, result) {
            if (err) { throw err; }
            else {
              console.log(result.keyprivate);
              var decode = jwt.verify(element.id, result.keyprivate);
              if (decode.nombre === element.nombre) {
                res.send(element.id);
              }
              
            }
          });
          console.log("los datos se pasaron exitosamente");
        } else {
          console.log("el password no es correcto");
          res.send("0");
        }
      });
    });
  });
});

app.post("/datos", (req, res) => {
  var id = req.param('id');
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var query = { id: id };
    dbo.collection("usuario").find(query).toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
});

app.get("/archivoRegistro", (req, res) => {
  res.sendFile(__dirname + "/public/registroUsuario.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/homeJuego.html");
});






app.post("/registrar", (req, res) => {
  var nombre = req.param('nombre');
  var correo = req.param('correo');
  var password = req.param('password');
  var genero = req.param('genero');
  var fechaCreacion = req.param('fecha_creacion');
  var foto = req.param('foto');
  console.log("nombre del archivo: " + foto);

  ress = res;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var llave = CryptoJS.AES.encrypt(password, correo).toString();

    dbo.collection("private").findOne({}, function (err, result) {
      if (err) throw err;
      var token = jwt.sign({
        correo: correo,
        password: password,
        nombre: nombre
      }, result.keyprivate);
      console.log(result.keyprivate);
      console.log("token dentro d ela funcion: " + token);
      var myobj = { id: token, nombre: nombre, correo: correo, password: llave, genero: genero, fecha_creacion: fechaCreacion, foto: foto };
      dbo.collection("usuario").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("registrado");
        ress.send("1");
      });
    });
  });

});

/*
Tabla: juego
id_juego
clasificacion
instrucciones
controles
descripcion
calificacion
*/
app.post("/insertarjuego",(req,res)=>{
  var idjuego=req.param('idjuego');
  var clasificacion=req.param('clasificacion');
  var instruccion=req.param('instruccion');
  var controles=req.param('controles');
  var descripcion=req.param('descripcion');
  var calificacion=req.param('calificacion');

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { id_juego: idjuego, clasificacion: clasificacion, instruccion: instruccion, controles: controles, descripcion: descripcion, calificacion: calificacion };
    dbo.collection("juego").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("se insertaron los datos");
      db.close();
    });
  });
});

/* 
tabla: nivel
id_juego
descripcion
dificultad
puntaje
*/
app.post("/insertarnivel",(req,res)=>{
  var idjuego=req.param('idjuego');
  var descripcion=req.param('descripcion');
  var deficultad=req.param('deficultad');
  var puntaje=req.param('puntaje');

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { id_juego: idjuego, descripcion: descripcion, deficultad: deficultad, puntaje: puntaje };
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

/**
 tabla: alumno
 id_alumno
 puntos
 opiniones
 historial
 estado //de ciudad
 */
app.post("/insertalumno",(req,res)=>{
  var id_alumno = req.param('id_alumno');
  var puntos=req.param('puntos');
  var opiniones=req.param('opiniones');
  var historial=req.param('historial');
  var estado=req.param('estado');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { id_alumno: id_alumno, 
      puntos: puntos, 
      opiniones: opiniones,
    historial: historial,
    estado: estado };
    dbo.collection("alumno").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

/*
tabla: educador
id_educador
tipo
*/
app.post("/educador",(req,res)=>{
  var id_educador = req.param('id_educador');
  var tipo=req.param('tipo');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { id_educador: id_educador, tipo: tipo };
    dbo.collection("educador").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

/*
tabla: detalle_nivel
id_jugador
id_juego
puntaje_max
*/
app.post("/detalle_nivel",(req,res)=>{
  var id_jugador = req.param('id_jugador');
  var id_juego=req.param('id_juego');
  var puntaje_max=req.param('puntaje_max');

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { id_jugador: id_jugador, id_juego: id_juego, puntaje_max: puntaje_max };
    dbo.collection("detalle_nivel").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

/*
tabla: imagen 
id
nombre
descripcion
ubicacion
*/
app.post("/imagen",(req,res)=>{
  var id = req.param('id');
  var nombre=req.param('nombre');
  var descripcion=req.param('descripcion');
  var ubicacion=req.param('ubicacion');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { id: id, nombre: nombre, descripcion: descripcion, ubicacion: ubicacion};
    dbo.collection("imagen").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

/*
tabla: recomendacion
id
id_alumno
titulo
tipo
asunto
url
compatibilidad
fecha_creado
fecha_actualizado
fecha_eliminado
*/
app.post("/recomendacion",(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

app.listen(port, () => { console.log("se inicio el servidor"); });