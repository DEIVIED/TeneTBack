const mongoose=require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema= mongoose.Schema;

const UserSchema = new Schema({
    prenom: {
        type: String,
        trim: true,
        required: [true, 'fullname is required'],
    },
    nom: {
        type: String,
        trim: true,
        required: [true, 'fullname is required'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        unique: 'Two users cannot share the same email ({VALUE})',
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required']
    },
    followers : [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'User'
        }
    ],
    following : [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'User'
        }
    ],
    numero: {
        type: String,
    },
    avatar_url: {
        type: String
    },
    profil: {
        type: String,
        required: true,
        default: 'guest'
    },
    isGranted: {
        type: Boolean,
        default: false
    },
    profiluser: {
        type : Object,
    }
}, {
    timestamps: true
});

UserSchema.plugin(beautifyUnique);

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const user = this;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();

});


function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

``
UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports=mongoose.model('User',UserSchema);