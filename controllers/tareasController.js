const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    //Obtener el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    //Obtener valor del input (nombre de la tarea)
    const { tarea } = req.body;

    //Estado 0 = estado incompleto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la BD y reedireccionar
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    if (!resultado) {
        return next();
    }
    res.redirect(`/proyectos/${req.params.url}`)
}
exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id } });
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if (!resultado) return next();
    res.status(200).send('Actualizando..');
}
exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params;
    const resultado = await Tareas.destroy({ where: { id } });
    if (!resultado) return next();
    res.status(200).send('Tarea Eliminada Correctamente');
}