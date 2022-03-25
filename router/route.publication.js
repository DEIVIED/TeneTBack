const express = require('express');
const router = express.Router();
const auth = require('../helpers/auth');
const multer = require('../helpers/multer-config')
const Publication = require('../model/pubilcation.model');
const PublicationService = require('../services/publication.service')(Publication);

router.post('/newPost', auth, multer, async function (req, res, next) {
  // console.log(req.body,req.file);
  const url = req.protocol + '://' + req.get('host');
  const publication = {
    publication: req.body.publication,
    imageUrl: url + '/images/' + req.file.filename,
    filePath: 'images/' + req.file.filename,
    userId: req.body.userId
  };
  try {
    let response = await PublicationService.addNewPublication(publication)
    res.json(response);
  } catch (error) {
    next(error)
  }
});

router.put('/updatePost/:id',auth,multer, async function (req, res, next) {
  // console.log(auth);
  const url = req.protocol + '://' + req.get('host');
  const authenticationUser = await req.auth.userId;
  // console.log(authenticationUser);
  const publicationUpdate = {
    _id: req.params.id,
    publication: req.body.publication,
    imageUrl: url + '/images/' + req.file.filename,
    filePath: 'images/' + req.file.filename,
    userId: req.body.userId
  };
  try {
    const result = await PublicationService.updateOnePublicationById(publicationUpdate,
      publicationUpdate._id,authenticationUser);
    res.json(result)
  } catch (error) {
    next(error)
  }

});

router.get('/displayYourPost/:id', auth, async function (req, res, next) {
  const publicationId = req.params.id;
  try {
    let publication = await PublicationService.getOnePublicationById(publicationId)
    res.json(publication);
  } catch (error) {
    next(error)
  }
});

// router.get('/displayAnotherPost/:id',async function (req, res, next) {
//   const publicationId = req.params.id;
//   try {
//     let publication = await PublicationService.getOnePublicationById(publicationId)
//     res.json(publication);
//   } catch (error) {
//     next(error)
//   }
// });

router.get('/posts', async function (req, res, next) {
  try {
    const response = await PublicationService.getAllPublications()
    res.json(response)
  } catch (error) {
    next(error)
  }
});

router.get('/yourPosts', auth, async function (req, res, next) {
  try {
    const response = await PublicationService.getAllPublications()
    res.json(response)
  } catch (error) {
    next(error)
  }
});

router.delete('/deleteYourPost/:id', auth, async function (req, res, next) {
  try {
    const deletePost = await PublicationService.deleteYourPublication(req.params.id,req.auth.userId)
    res.json(deletePost)
  } catch (error) {
    next(error)
  }
});



module.exports = router;