const {Router} = require('express');
const {check} = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto,
    obtenerProducto, 
    obtenerProductos, 
    actualizarProducto, 
    eliminarProducto } = require('../controllers/productos');

const { existeIdProducto, 
    productoActivo, 
    existeNombreProducto,
    existeIdCategoria} = require('../helpers/db-validators');
const router = Router();

//obtener todas la categorias - publico
router.get('/',obtenerProductos)

//obtener una categoria por id - publico 
router.get('/:id',[
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom(existeIdProducto),
    check('id').custom(productoActivo),
    validarCampos
],obtenerProducto)

//crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,//valida si existe el usuario y sube toda la info a req.usuario
    check('categoria','No es un id de mongo').isMongoId(),
    check('nombre').custom(existeNombreProducto),
    validarCampos
],crearProducto)
//actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de categoria en mongo').isMongoId(), //no es necesaria enviarla es opcional
    check('id').custom(existeIdProducto),//hacer validaciones para saber si vienen esos datos del req.body
    validarCampos
],actualizarProducto)

//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom(existeIdProducto),
    check('id').custom(productoActivo),
    validarCampos
],eliminarProducto)

module.exports = router;