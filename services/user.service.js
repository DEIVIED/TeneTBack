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

const getUserById = User => async (id) => {
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            return ({
                status: 'success',
                message: 'User found',
                payload: user
            })
        }
        else {
            return ({
                status: 'fail',
                message: 'User not found',
                payload: null
            })
        }

    } catch (error) {
        return ({
            status: "error",
            message: error,
            payload: null
        });
    }

}

const updateUser = User => async (id, newUser, reqAuthUserId) => {
    // const _user = new User({_id:id,...newUser});
    try {
        const user = await User.findOne({ _id: id })
        if (!user) {
            return ({
                status: "error",
                message: "user not found",
                payload: null
            })
        }
        else if (id !== reqAuthUserId) {
            // console.log('3');
            return ({
                status: "error",
                message: "Unauthorized request!",
                payload: null
            })
        }
        else if (id === reqAuthUserId) {
            // console.log('4');
            const update = await User.updateOne({ _id: id }, { ...newUser })

            if (!update) {
                return ({
                    status: "error",
                    message: "failed changes!",
                    payload: null
                })

            }
            else {
                const userUpdate = await User.findOne({ _id: id })
                // console.log('5',userUpdate);
                return ({
                    status: "success",
                    message: "post edited succesfully!",
                    payload: userUpdate
                });
            }
        }
    } catch (error) {
        return ({
            status: "error",
            message: error,
            payload: null
        });
    }

}

const deleteUser = User => async (id, reqAuthUserId) => {
    try {
        const user = await User.findOne({ _id: id })
        if (!user) {
            return ({
                status: "error",
                message: "user not found!",
                payload: null
            })
        }
        else if (id !== reqAuthUserId) {
            return ({
                status: "error",
                message: "Unauthorized request!",
                payload: null
            })
        }
        else if (id === reqAuthUserId) {
            const deleteUser = await User.deleteOne({ _id: id })
            if (!deleteUser) {
                return ({
                    status: "error",
                    message: "failed changes!",
                    payload: null
                })

            } else {
                return ({
                    status: "success",
                    message: "user deleted succesfully!",
                    payload: null
                });

            }
        }

    } catch (error) {
        return ({
            status: 'fail',
            message: 'Sorry',
            payload: error
        });
    }
}


const getAllUsers = User => async () => {
    try {
        const users = await User.find();
        if (users) {
            return ({
                status: 'success',
                message: 'All Users',
                payload: users
            });
        }
    } catch (error) {
        return ({
            status: 'fail',
            message: 'Sorry',
            payload: error
        });
    }

}

const deleteUserByAdmin = User => async (id, adminId) => {
    const admin = await User.findOne({ _id: adminId })
    if (admin.profil === 'admin') {
        try {
            const user = await User.findOne({ _id: id })
            if (!user) {
                return ({
                    status: "error",
                    message: "user not found!",
                    payload: null
                })
            }

            else {
                const deleteUser = await User.deleteOne({ _id: id })
                if (!deleteUser) {
                    return ({
                        status: "error",
                        message: "failed!",
                        payload: null
                    })

                } else {
                    return ({
                        status: "success",
                        message: "user deleted succesfully!",
                        payload: null
                    });

                }
            }

        } catch (error) {
            return ({
                status: 'fail',
                message: 'Sorry',
                payload: error
            });
        }
    }
    else {
        return ({
            status: "error",
            message: "Unauthorized request!",
            payload: null
        })
    }

}





module.exports = (User) => {
    return ({
        register: register(User),
        authenticate: authenticate(User),
        getUserById: getUserById(User),
        updateUser: updateUser(User),
        deleteUser: deleteUser(User),
        getAllUsers: getAllUsers(User),
        deleteUserByAdmin: deleteUserByAdmin(User)

    });
};