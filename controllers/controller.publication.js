const Publication = require('../model/pubilcation.model');
const User = require('../model/users.model');
const fs = require('fs');

const getAllPublicqtions = async (req, res) => {
    Publication.find().then(publications => {
        res.status(201).json({
            status: 'succes',
            publications: publications
        })
    }).catch(error => {
        res.status(500).json({
            status: 'error',
            error: error
        })
    });
}

const postPublication = (req, res, next) => {
    console.log(req.body.publication, req.body.userId, req.body.imageUrl);
    // req.body.publication = JSON.parse(JSON.stringify(req.body.publication));

    const url = req.protocol + '://' + req.get('host');
    const publication = new Publication({
        publication: req.body.publication,
        imageUrl: url + '/images/' + req.file.filename,
        filePath: 'images/' + req.file.filename,
        userId: req.body.userId
    });
    publication.save().then(
        (publication) => {
            res.status(201).json({
                message: 'Post saved successfully!',
                publication: publication
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}


const deletePublication = (req, res) => {
    Publication.findOne({ _id: req.params.id }).then(
        (publication) => {
            if (!publication) {
                res.status(404).json({
                    error: 'Publication nexiste pas'
                });
            }
            if (publication.userId !== req.auth.userId) {
                res.status(400).json({
                    error: 'Unauthorized request!'
                });
            }
            if (publication.userId === req.auth.userId) {
                console.log(publication.filePath)
                fs.unlink(publication.filePath, () => {
                    publication.deleteOne({ _id: req.params.id })
                        .then(
                            (publication) => {

                                res.status(200).json({
                                    message: 'Deleted!'
                                });
                            })
                        .catch(
                            (error) => {
                                res.status(400).json({
                                    error: error
                                });
                            }
                        );

                });

            }

        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};

const getOnePublication = (req, res) => {
    Publication.findOne({ _id: req.params.id }).then(
        (publication) => {
            if (!publication) {
                res.status(404).json({
                    error: 'Publication nexiste pas'
                });
            }
            res.status(200).json({
                status: 'success',
                publication: publication
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}


const putPublication = (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const publicationUpdate = new Publication({
        _id: req.params.id,
        publication: req.body.publication,
        imageUrl: url + '/images/' + req.file.filename,
        filePath: 'images/' + req.file.filename,
        userId: req.body.userId
    });
    Publication.findOne({ _id: req.params.id }).then(
        (publication) => {
            if (!publication) {
                res.status(404).json({
                    error: 'Publication nexiste pas'
                });
            }
            if (publication.userId !== req.auth.userId) {
                res.status(400).json({
                    error: 'Unauthorized request!'
                });
            }
            if (publication.userId === req.auth.userId) {
                fs.unlink(publication.filePath, () => {
                    Publication.updateOne({ _id: req.params.id }, publicationUpdate).then(
                        (publicationUpdate) => {
                            res.status(201).json({
                                message: 'publication updated successfully!',
                                publication: publicationUpdate
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                })
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
}


module.exports = {
    getAllPublicqtions,
    postPublication,
    deletePublication,
    getOnePublication,
    putPublication
}