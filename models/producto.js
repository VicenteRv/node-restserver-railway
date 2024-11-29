const {Schema, model } = require('mongoose');
// ponerle new para que nos salgan las ayudas
const ProductoSchema = new Schema({
    nombre:{
        type: String,
        require: [true,"El nombre es obligatorio"],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        require: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    },
    precio:{
        type: Number,
        default: 0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true,
    },
    descripcion:{type: String,require:true},
    disponible:{type: Boolean, default: true}
})
//modifica la respuestas donde se hace el res.json del molelo
ProductoSchema.methods.toJSON = function(){
    const {__v,estado,...data} = this.toObject();
    return data;
}
module.exports = model('Producto',ProductoSchema);
// Los modelos siempre los vamos a poner con Mayuscula y en singular 'Producto'
