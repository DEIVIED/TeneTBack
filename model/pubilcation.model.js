const timespan = require('jsonwebtoken/lib/timespan');
const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    publication : {
        type : String,
    },

    imageUrl: { 
        type: String, 
    },
    filePath: {
        type: String,
    },

    userId: { 
        type: String,
        required: true 
    }

})

const publicationModel = mongoose.model('Publication', publicationSchema);

module.exports = publicationModel;