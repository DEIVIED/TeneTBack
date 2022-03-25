const express = require('express');
const router = express.Router();
const User = require('../model/users.model');
const userService = require('../services/user.service')(User);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ user: 'Ok' });
});

router.post('/signUp', async (req, res, next) => {
  const _user = req.body;
  try {
    let response = await userService.register(_user);
    res.json(response);
  } catch (error) {
    next(error)
  }
});

// router.post('/login', async (req, res, next) => {
//   try {
//     let { email, password, profil } = req.body;
//     res.json(await essai.login(email, password, profil));
//   } catch (error) {
//     next(error)
//   }

// });

router.post('/signIn', async (req, res, next) => {
  try {
    let { email, password, profil } = req.body;
    res.json(await userService.authenticate(email, password, profil));
  } catch (error) {
    next(error)
  }

});

// router.get("/login", formController.logPage);

// router.post('/logOut_form', formController.logOut);

// router.post('/signUp', helpers.verifEmailAndNumero, formController.signUp);

// router.post('/password_form', formController.changePassword)
// router.get('/profil', auth, formController.profilPage);
// router.get('/userHome', auth, formController.userPage);
// router.get('/password', auth, formController.passwordPage);
// router.post('/profilUser_form', auth, formController.saveProfil);




module.exports = router;


