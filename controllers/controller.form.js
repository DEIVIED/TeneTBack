const User = require('../model/users.model');
const bcrypt = require('bcrypt');
// const signUp = (User) => async (user) => {
//   const userr = new User(user)
//   try {
    
//     const result = await userr.save();
//     if (result) {
//       return ({
//         status: 'success',
//         message: 'user saved successfully',
//         payload: result
//       });
//     }
//   } catch (error) {
//     return ({
//       status: 'fail',
//       message: 'user fail to register',
//       payload: error
//     });
//   }
// }

const signUp = (req, res) => {
  const user = new User({
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    numero: req.body.numero,
    profil: req.body.profil,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User was registered successfully!" });
  });
};

signIn = User => async (email, profil, password) => {
  try {
    const user = await User.findOne({
      email: email
    });
    if (comparePassword(password, user.password)) {
      const token = generateMeAToken(user);
      return ({
        status: "success",
        message: "user authenticated succssfully!!!",
        payload: {
          user: user.toJSON(),
          token: token
        }
      });
    } else {
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
};



module.exports = {
  signUp,
  signIn,
  // authenticate: authenticate(User),
  // getUserById : getUserById(User),
  // updateUser: updateUser(User),
  // deleteUser : deleteUser(User)
};


// module.exports = (User) => {
//   return ({
//     signUp: signUp(User),
//     signIn: signIn(User)
//     // authenticate: authenticate(User),
//     // getUserById : getUserById(User),
//     // updateUser: updateUser(User),
//     // deleteUser : deleteUser(User)

//   });
// };
