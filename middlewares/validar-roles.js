const { response, request } = require("express");



const esAdminRole = (req = request,res =response,next) => {
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar le token'
        });
    }
    const {rol, nombre } = req.usuario;
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }
    next();
}

const tieneRole = (...roles ) => {
    return (req = request,res =response,next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar le token'
            });
        }
        if(!roles.includes(req.usuario.rol)){{
            return res.status(401).json({
                msg: `El servicio requiere unos de estos roles ${roles}`
            })
        }}

        next();
    }
}

module.exports = {
   esAdminRole,
   tieneRole
};