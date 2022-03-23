const { defaultConfiguration } = require('express/lib/application');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    prenom : {
        type : String,
        required: true
    },
    nom : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    numero : {
        type : Number,
        required: true,
        unique : true
    },
    profil : {
        type : String,
        default : 'Gestionnaire'        
    },
    secret : {
        type : String,
        required: true
    }
})


