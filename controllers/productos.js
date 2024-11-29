const { response, request } = require("express");
const {Producto} = require('../models');
const { existeNombreProducto } = require("../helpers/db-validators");

//obtener productos - paginado - total - populate
const obtenerProductos = async(req = request, res = response) =>{
    const {limite = 10,desde = 0} = req.query;
    const query = {estado:true };

    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        productos
    });
}

//obtener producto - populate {}
const obtenerProducto = async(req = request, res = response) =>{
    const {id} = req.params;
    const producto = await Producto.findById(id)
    .populate('usuario','nombre')
    .populate('categoria','nombre');
    res.json(producto);
}

//crear producto - registrado y con token 
const crearProducto = async( req = request, res = response ) =>{
    const {estado,
        descripcion='Sin descripcion',
        usuario,
        ...body} = req.body;

    const productoBD = await Producto.findOne({nombre:body.nombre});
    if(productoBD){
        return res.status(400).json({
            msg: `El producto ${productoBD.nombre}, ya existe` 
        })
    }
    // generar la data a guardar
    const data = {
        ...body,
        descripcion,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto(data);
    //guardar en db
    await producto.save();
    res.status(201).json({
        producto,
        msg: 'El producto se creo con exito'
    })
}

//actualizar/modificar producto - nombre
const actualizarProducto = async(req = request, res = response)=>{
    const {id} = req.params;
    const {estado,
        usuario,
        descripcion,
        categoria,
        ...data} = req.body;
    if(data.nombre){
        const productoExistente = await Producto.findOne({ nombre: data.nombre.toUpperCase() });
        if (productoExistente && productoExistente._id.toString() !== id) {
            return res.status(400).json({
                msg: `El nombre del producto ${data.nombre} ya está registrado, si no quiere modificar el nombre no lo agregue, o cambie el nombre`
            });
        }
        data.nombre = data.nombre.toUpperCase();
    }
    if(categoria !== undefined){
        data.categoria = categoria;
    }
    // Solo asignar descripcion si viene en la solicitud
    if (descripcion !== undefined) {
        data.descripcion = descripcion;
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true})
    .populate('usuario','nombre')
    .populate('categoria','nombre');
    res.json(producto);
}

//borrar producto estado: false
const eliminarProducto = async(req = request, res = response)=>{
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false},{new:true})
    .populate('usuario','nombre');
    res.status(404).json({
        msg: `Producto con id: ${id}  eliminada`,
        productoBorrado
    })
}
module.exports = {
   actualizarProducto,
   crearProducto,
   eliminarProducto,
   obtenerProductos,
   obtenerProducto,
};