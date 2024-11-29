const { Categoria,Role,Usuario, Producto } = require('../models');

//Usuarios
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
const existeNombreUsuario = async(nombre)=>{
    const existeUsuario = await Usuario.findById(nombre);
    if(!existeUsuario){
        throw new Error(`El usuario con nombre: ${nombre} no existe`);
    }
}
//categorias
const existeIdCategoria = async(id)=>{
    const existecategoria = await Categoria.findById(id);
    if(!existecategoria){
        throw new Error(`El id: ${id} de categoria no existe`);
    }
}
const existeNombreCategoria = async (nombre)=>{
    // Convertir a mayúsculas para comparación uniforme
    const nombreMayus = nombre.toUpperCase();
    // Buscar en la base de datos si ya existe
    const categoriaDB = await Categoria.findOne({ nombre: nombreMayus });

    if (categoriaDB) {
        throw new Error(`El nombre: ${nombreMayus} ya existe.`);
    }
}
const categoriaActiva = async(id)=>{
    const activa = await Categoria.findById(id);
    if(!activa.estado){
        throw `La categoria no existe`;
    }
}
//productos
const existeIdProducto = async(id)=>{
    const existeidproducto = await Producto.findById(id);
    if(!existeidproducto){
        throw new Error(`El id: ${id} de producto no existe`);
    }
}
const existeNombreProducto = async (nombre)=>{
    // Convertir a mayúsculas para comparación uniforme
    const nombreMayus = nombre.toUpperCase();
    // Buscar en la base de datos si ya existe
    const productoDB = await Producto.findOne({ nombre: nombreMayus });
    if (productoDB) {
        throw new Error(`El nombre: ${nombreMayus} ya existe.`);
    }
}
const productoActivo = async(id)=>{
    const activo = await Producto.findById(id);
    if(!activo.estado){
        throw `El producto no existe`;
    }
}
module.exports = {
    categoriaActiva,
    existeEmail,
    existeUsuarioPorId,
    existeIdCategoria,
    existeIdProducto,
    existeNombreCategoria,
    existeNombreProducto,
    existeNombreUsuario,
    productoActivo,
    validacionRol,
};