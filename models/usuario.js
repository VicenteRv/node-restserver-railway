
const {Schema, model} = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required:  [true,'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required:  [true,'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required:  [true,'La contraseña es obligatoria'],
    }, 
    imagen: {
        type: String,
    }, 
    rol : {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE','USER_ROLE'] si lo descomentamos debemos poner los roles de la bd
    }, 
    estado: {
        type: Boolean,
        default: true,  
    }, 
    google: {
        type: Boolean,
        default: false,
    }, 
});

UsuarioSchema.methods.toJSON = function(){
    const {__v,password,_id, ...usuario } = this.toObject();
    usuario.uid=_id;
    return usuario; 
}

module.exports = model('Usuario',UsuarioSchema);



