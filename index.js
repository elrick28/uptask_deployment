const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env' });


//helpers con algunas funciones
const helpers = require('./helpers');

//conexión a la bd
const db = require('./config/db');

//importar los modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//Conexión al servidor
db.sync()
    .then(() => console.log("Conectado al Servidor"))
    .catch(error => console.log(error));

//crear una app para express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }))

//Agregar express validator a toda la app
app.use(expressValidator());

//añadir carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

//Agregar coockie parser¿?
app.use(cookieParser());

//session permite la conexión permanente
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
})

app.use('/', routes());

//asignar un puerto y host
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host);