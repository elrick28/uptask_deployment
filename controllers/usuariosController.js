const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res, next) => {
    res.render('crearCuenta', { nombrePagina: 'Crear Cuenta en UpTask' });
}
exports.formIniciarSesion = (req, res, next) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', { nombrePagina: 'Iniciar Sesión en UpTask', error });
}
exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const { email, password } = req.body;
    //Crear Usuario
    try {
        await Usuarios.create({ email, password })
        res.redirect('/iniciar-sesion')

        //Verificación de mail por cuenta
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        const usuario = {
            email
        }
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
        //

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', { mensajes: req.flash(), nombrePagina: 'Crear Cuenta en UpTask', email, password });
    }
}
exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Restablecer Contraseña'
    })
}
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta Activada Correctamente');
    res.redirect('/iniciar-sesion');
}