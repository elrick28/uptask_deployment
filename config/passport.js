const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo que se quiere autenticar
const Usuarios = require('../models/Usuarios');

//LocalStrategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por defaul espera usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({ where: { email, activo: 1 } })

                if (!usuario.verificarPassword(password)) {
                    return done(null, false, { message: 'Password Incorrecto' });
                }
                return done(null, usuario);

            } catch (error) {
                //Usuario inexistente
                return done(error, false, { message: 'Esa cuenta no existe' });
            }
        }
    )
);
//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})
//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})
//exportar
module.exports = passport;