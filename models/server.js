const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
class Server{
    constructor(){
        this.app            = express();
        this.port           = process.env.PORT;
        this.usuariosPath   = '/api/usuarios';
        this.authPath       = '/api/auth';
    
        //Conectar a BD
        this.conectarDB();

        //middlewares 
        this.middlewares();

        //rutas de la aplicacion 
        this.routes();
    }
    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        //CORS
        this.app.use(cors());
        //lectura y parse del body 
        this.app.use(express.json());

        //directorio publico 
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.authPath ,require('../routes/auth'));
        this.app.use(this.usuariosPath ,require('../routes/usuarios'));
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto ',this.port);
        });
    }
}

module.exports= Server;

