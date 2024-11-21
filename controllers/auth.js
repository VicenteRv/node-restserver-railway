const {response, request, json} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSingIn = async(req = request,res = response) => {
    const {id_token} = req.body;
    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            //si no exite lo creamos
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }
            usuario = new Usuario(data);
            await usuario.save();
        }
        //si el usuario en bd tiene estado: false
        if(!usuario.estado){
            return res.status(401).json({
                msg: `Hable con el administrador, usuario ${usuario.nombre} bloqueado`
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
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
   login,
   googleSingIn
};