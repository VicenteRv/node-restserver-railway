const { response, request } = require("express");
const { Usuario, Producto, Categoria } = require("../models");
const usuario = require("../models/usuario");
const categoria = require("../models/categoria");
const { ObjectId } = require("mongoose").Types;
const coleccionePermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'roles',
]
const buscarUsuarios = async(termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid(termino);//true
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:(usuario) ? [usuario]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or:[{nombre: regex},{correo: regex}], //{nombre: regex,estado: true} pero mejoramos a and
        $and: [{estado: true}]
    });
    res.json({
        results:usuarios
    });
}
const buscarProductos = async(termino = '',res = response)=>{
    const esMongoId = ObjectId.isValid(termino);//true
    if(esMongoId){
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results:(producto) ? [producto]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre: regex,estado:true})
                                    .populate('categoria','nombre');
    res.json({
        results:productos
    });
}
const buscarCategorias = async(termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid(termino);//true
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results:(categoria) ? [categoria]: []
        });
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex,estado: true});
    res.json({
        results:categorias
    });
}
const buscar = (req = request, res = response)=>{
    const {coleccion, termino} = req.params;
    if(!coleccionePermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionePermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res)
        break;
        case 'productos':
            buscarProductos(termino,res)            
        break;
        case 'categorias':
            buscarCategorias(termino,res)            
        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }
}

module.exports = {
   buscar
};