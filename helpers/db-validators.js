const Role = require('../models/role');
const Usuario = require('../models/usuario');


const validacionRol = async(rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la bd`)
    }
}
const existeEmail = async(correo = '')=>{
    const emailExist = await Usuario.findOne({correo});
    if(emailExist){
        throw new Error(`El correo: ${correo} ya esta creado`);
    }
}
const existeUsuarioPorId = async(id)=>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id no existe: ${id}`);
    }
}
module.exports = {
   validacionRol,
   existeEmail,
   existeUsuarioPorId
};