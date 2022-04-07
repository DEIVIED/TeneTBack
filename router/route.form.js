const express = require('express');
const router = express.Router();
const User = require('../model/users.model');
const userService = require('../services/user.service')(User);
const auth = require('../helpers/auth');
const { openDelimiter } = require('ejs');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ user: 'Ok' });
});

router.post('/signUp', async (req, res, next) => {
  const _user = req.body;
  try {
    let response = await userService.register(_user);
    console.log('response');
    res.json(response);
  } catch (error) {
    next(error)
  }
});

router.post('/signIn', async (req, res, next) => {
  try {
    let { email, password, profil } = req.body;
    res.json(await userService.authenticate(email, password, profil));
  } catch (error) {
    next(error)
  }

});

router.put('/updateUser/:id', auth, async function (req, res, next) {
  const authUser = await req.auth.userId;

  const newUser = {
    // _id:req.params.id,
    ...req.body
  };
  try {
    const result = await userService.updateUser(req.params.id, newUser, authUser)
    res.json(result)
  } catch (error) {
    next(error)
  }

});

// router.put('/changeYourPassword/:id',auth ,async function (req,res,next){
//   console.log('ok');
//   const authUser = await req.auth.userId;
//   try {
//     let { old,newPass } = req.body;
//     const result = await userService.changePassword(req.params.id,old,newPass,authUser)
//     res.json(result)
//   } catch (error) {
//     next(error)
//   }

// })

router.get('/diplayUser/:id', async function (req, res, next) {
  const userId = req.params.id;
  try {
    let user = await userService.getUserById(userId)
    res.json(user);
  } catch (error) {
    next(error)
  }
});

// router.get('/displayAnotherUser/:id',async function (req, res, next) {
//   const userId = req.params.id;
//   try {
//     let user = await userService.getUserById(userId)
//     res.json(user);
//   } catch (error) {
//     next(error)
//   }
// });

router.get('/users', async function (req, res, next) {
  try {
    const response = await userService.getAllUsers()
    res.json(response)
  } catch (error) {
    next(error)
  }
});

router.delete('/deleteYourAccount/:id', auth, async function (req, res, next) {
  try {
    const deleteCount = await userService.deleteUser(req.params.id, req.auth.userId)
    res.json(deleteCount)
  } catch (error) {
    next(error)
  }
});
router.delete('/deleteUser/:id', auth, async function (req, res, next) {
  try {
    const deleteCount = await userService.deleteUserByAdmin(req.params.id, req.auth.userId)
    res.json(deleteCount)
  } catch (error) {
    next(error)
  }
});


module.exports = router;


