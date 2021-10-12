const CryptoJS = require("crypto-js");
const session = require("express-session");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000
const MongoClient = require('mongodb').MongoClient;
const base = "base";
const user = "mi-diorama-virtual";
const password = "nuestroproyecto1052";
const url = "mongodb+srv://" + user + ":" + password + "@cluster0.s9ejk.mongodb.net/" + base + "?retryWrites=true&w=majority";

app.use(session({
  secret: process.env.SESSION_SECRET || 'some-secret',
  reseve: true,
  saveUninitialized: true
}));

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  //res.send("hola");
});
app.post("/login", (req, res) => {
  var correo = req.param('correo');
  var password = req.param('password');
  //console.log(correo);
  //ress = res;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var llave = CryptoJS.AES.encrypt(password, correo).toString();
    var query = { correo: correo};
    dbo.collection("usuario").find(query).toArray(function (err, result) {
      if (err) { throw err;}
      result.forEach(element => {
        console.log(element.nombre)
        var bytes = CryptoJS.AES.decrypt(element.password, correo);
        var llaveOriginal = bytes.toString(CryptoJS.enc.Utf8);
        if (password === llaveOriginal) {
          var auth = function (req, res, next) {
            if (req.session && req.session.user === element.nombre && req.session.admin)
              return next();
            else
              return res.sendStatus(401);
          };
          req.session.user = element.nombre;
          req.session.genero = element.genero;
          req.session.foto = element.foto;
          console.log("los datos se pasaron exitosamente");
          res.send("1");
        }else{
          console.log("el password no es correcto");
          res.send("0");
        }
      });
      
      db.close();
    });
  });
});

app.post("/datos", (req, res) => {
  res.send('[{"nombre": "' + req.session.user + '","genero": "' + req.session.genero + '","foto": "' + req.session.foto + '"}]');
});
app.get("/cerrarsession", (req, res) => {
  req.session.destroy();
  console.log("sesion cerrada");
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
  //var idUsuario=
  ress = res;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(base);
    var llave = CryptoJS.AES.encrypt(password, correo).toString();
    var myobj = { nombre: nombre, correo: correo, password: llave, genero: genero, fecha_creacion: fechaCreacion, foto: foto };
    dbo.collection("usuario").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      ress.send("1");
      db.close();
    });
  });

});
app.listen(port, () => { console.log("se inicio el servidor"); });