const {Router} = require('express');
const {check} = require('express-validator');

// const { validarCampos } = require('../middlewares/validar_Campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { validacionRol, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id','No es in Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol', ).custom(validacionRol),
    validarCampos
], usuariosPut);

router.post('/', [
    // campo      mensaje de error          verifica el campo
    check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('password','El password es obligatorio y de mas de 8 caracteres').isLength({min:8}), 
    check('correo','El correo no es valido').isEmail(), 
    check('correo').custom(existeEmail),
    
    // check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),--validar en bd
    check('rol', ).custom(validacionRol),
    
    validarCampos
], usuariosPost);
// endpoin,middleware,controler

router.delete('/:id',[
    validarJWT,
    // esAdminRole,//tiene que ser admin o no pasa a los demas
    tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),//roles que pueden pasar
    check('id','No es in Id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

module.exports = router;