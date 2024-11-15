const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req = request,res = response)=>{
    const {correo, password} = req.body;
    try {
        //verificar si el usuario existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'El email/correo son incorrectos - correo'
            });
        }
        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El email/correo son incorrectos - estado:false'
            });
        }
        //verificar la contraseña
        const validarPass = bcryptjs.compareSync(password,usuario.password);
        if(!validarPass){
            return res.status(400).json({
                msg: 'El email/correo son incorrectos - password'
            });
        }
        //generar el JSWT
        const token = await generarJWT(usuario.id);
        res.json({
             usuario,
             token
        })        
    } catch (error) {
        console.log(error);
        return res.json({
            msg: 'Hable con el admin'
        })
    }

}

module.exports = {
   login
};