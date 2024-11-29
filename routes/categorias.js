const {Router} = require('express');
const {check} = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    eliminarCategoria } = require('../controllers/categorias');
const { existeIdCategoria, 
    existeNombreCategoria, 
    categoriaActiva } = require('../helpers/db-validators');
const router = Router();

//obtener todas la categorias - publico
router.get('/',obtenerCategorias)

//obtener una categoria por id - publico 
router.get('/:id',[
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom(existeIdCategoria),
    check('id').custom(categoriaActiva),
    validarCampos
],obtenerCategoria)

//crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,//valida si existe el usuario y sube toda la info a req.usuario
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)
//actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom(existeIdCategoria),
    check('nombre').custom(existeNombreCategoria),
    validarCampos
],actualizarCategoria)

//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido de mongo').isMongoId(),
    check('id').custom(existeIdCategoria),
    check('id').custom(categoriaActiva),
    validarCampos
],eliminarCategoria)

module.exports = router;