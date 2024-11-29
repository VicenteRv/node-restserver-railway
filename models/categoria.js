const {Schema,model } = require('mongoose');
// ponerle new para que nos salgan las ayudas
const CategoriaSchema = new Schema({
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
    }
})
//modifica la respuestas donde se hace el res.json del molelo
CategoriaSchema.methods.toJSON = function(){
    const {__v,estado,...data} = this.toObject();
    return data;
}
module.exports = model('Categoria',CategoriaSchema);
// Los modelos siempre los vamos a poner con Mayuscula y en singular 'Categoria'
