const {
    generateMeAToken,
    comparePassword
} = require('../helpers/auth.helpers')
const ROLES = require('../helpers/user.validations').roles;


const register = (User) => async (user) => {
    const _user = new User(user);
    try {
        const result = await _user.save();
        if (result) {
            return ({
                status: 'success',
                message: 'user saved successfully',
                payload: result
            });
        }
    } catch (error) {
        return ({
            status: 'fail',
            message: 'user fail to register',
            payload: error
        });
    }
};


const authenticate = User => async (email, password, profil) => {
    try {
        const upGranted = await User.updateOne({ email: email, profil: profil }, { isGranted: true })
        const user = await User.findOne({ email: email, profil: profil });
        //user.isGranted = true;
        if (comparePassword(password, user.password)) {
            const token = generateMeAToken(user);
            if (upGranted) {

                return ({
                    status: "success",
                    message: "user authenticated succssfully!!!",
                    payload: {
                        user: user.toJSON(),
                        token: token
                    }
                });
            } else {
            }
            return ({
                status: "error",
                message: "Invalid email or password!!!",
                payload: null
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "user can't authenticate",
            payload: null
        });
    }
}

const updateProfil = User => async (id) => {
    const profil = await User.findByIdAndUpdate(id, { profiluser: req.body })
        .then(() => {
            res.status(201).json({
                message: 'profil saved successfully!'
            });
        }).catch(
            error => {
                res.status(400).json({
                    error: error
                });
            }
        )
}

const getUserById = User => async (id) => {

}

const updateUser = User => (id, newUser) => {

}

const deleteUser = User => async (id) => {

}





module.exports = (User) => {
    return ({
        register: register(User),
        authenticate: authenticate(User),
        getUserById: getUserById(User),
        updateUser: updateUser(User),
        deleteUser: deleteUser(User)

    });
};