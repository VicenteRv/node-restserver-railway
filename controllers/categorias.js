const { response, request } = require("express");
const {Categoria} = require('../models');

//obtener categorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) =>{
    const {limite = 10,desde = 0} = req.query;
    const query = {estado:true };

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario','nombre')
    ])
    res.json({
        total,
        categorias
    });
}

//obtener categoria - populate {}
const obtenerCategoria = async(req = request, res = response) =>{
    const {id} = req.params;
    const categoria = await Categoria.findById(id)
    .populate('usuario','nombre');
    res.json(categoria);
}

//crear categoria - registrado y con token 
const crearCategoria = async( req = request, res = response ) =>{
    const nombre = req.body.nombre.toUpperCase();
        const categoriaDB = await Categoria.findOne({nombre});
        if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe` 
        })
    }
    // generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    //guardar en db
    await categoria.save();
    res.status(201).json({
        categoria,
        msg: 'La categoria se creo con exito'
    })
}

//actualizar/modificar categoria - nombre
const actualizarCategoria = async(req = request, res = response)=>{
    const {id} = req.params;
    const {estado, usuario,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})
    .populate('usuario','nombre');
    res.json(categoria);
}

//borrar categoria estado: false
const eliminarCategoria = async(req = request, res = response)=>{
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})
    .populate('usuario','nombre');
    res.status(404).json({
        msg: `Categoria con id: ${id}  eliminada`,
        categoria
    })
}
module.exports = {
   actualizarCategoria,
   crearCategoria,
   eliminarCategoria,
   obtenerCategorias,
   obtenerCategoria,
};