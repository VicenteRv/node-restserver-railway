const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");

const usuariosGet = async(req = request, res = response) => {
    const {limite = 5,desde = 0} = req.query;
    const query = {estado:true};

    const [total,usuarios] = await Promise.all([//ejecuta ambas promesas de manera simultanea
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        // respuesta
        total,
        usuarios,
    });
}
const usuariosPost = async(req = request, res = response) => {
    
    const {nombre,correo,password,rol} = req.body;
    const usuario = new Usuario({nombre,correo,password,rol});

    // encryptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);
    // guardar BD
    await usuario.save();
    res.json({
        usuario
    });
} 
const usuariosPut = async(req = request, res = response) => {
    const {id} = req.params;
    const {_id,password,google,correo, ...resto} = req.body
    // TODO validar contra base de datos
    if(password){
        // encryptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto,{new: true});
    res.json(usuario);
}
const usuariosDelete = async(req = request, res = response) => {
    const  {id} = req.params;
    // fisicamente lo borramos (no recomendado porque se elimia de otras cosas ligadas)
    // const usuario = await Usuario.findByIdAndDelete(id);
    //Cambiamos el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});//de momento lo cambio a true para no andarlo cambiando en la bd
    res.status(404).json(usuario);
}
module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPost,
    usuariosPut
}