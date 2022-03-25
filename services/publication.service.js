const { error } = require('console');
const fs = require('fs');


//Ajout d'une nouvelle publication

const addNewPublication = (Publication) => async (publication) => {
    const _publication = new Publication(publication);
    try {
        const result = await _publication.save();
        if (result) {
            return ({
                status: 'success',
                message: 'Publication saved successfully',
                payload: result
            });
        }
    } catch (error) {
        return ({
            status: 'fail',
            message: 'Publication fail to be saved',
            payload: error
        });
    }
};


//Affichage d'une publication en particulier

const getOnePublicationById = (Publication) => async (publicationId) => {
    try {
        const publication = await Publication.findOne({
            _id: publicationId
        });
        if (!publication) {
            return ({
                status: "error",
                message: "this post does not exist!",
                payload: null
            })

        } else {
            return ({
                status: "success",
                message: "publication found!",
                payload: publication
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: error,
            payload: null
        });
    }
}

//Modifier une publication en particulier
const updateOnePublicationById = (Publication) => async (publicationToUpdate, idPublicationToUpdate, reqAuthUserId) => {
    const publicationUpdate = new Publication(publicationToUpdate);
    try {
        // console.log(reqAuthUserId);
        console.log('1');
        const publication = await Publication.findOne({ _id: idPublicationToUpdate })
        if (!publication) {
            console.log('2');
            return ({
                status: "error",
                message: "this post does not exist!",
                payload: null
            })
        }
        else if (publication.userId !== reqAuthUserId) {
            console.log('3');
            return ({
                status: "error",
                message: "Unauthorized request!",
                payload: null
            })
        }
        else if (publication.userId === reqAuthUserId) {
            console.log('4');
            fs.unlink(publication.filePath, async () => {
                const update = await Publication.updateOne({ _id: idPublicationToUpdate }, publicationUpdate)
                if (!update) {
                    return ({
                        status: "error",
                        message: "failed changes!",
                        payload: null
                    })

                }
                console.log('5');
                const updatedPublication = await Publication.findOne({ _id: idPublicationToUpdate })
                console.log(update, publication, updatedPublication);
                return ({
                    status: "success",
                    message: "post edited succesfully!",
                    payload: updatedPublication
                });


            })

        }
    } catch (error) {
        console.log('6');
        return ({
            status: "error",
            message: error,
            payload: null
        });
    }
}

//Afficher toutes les publications

const getAllPublications = (Publication) => async () => {
    try {
        const publications = await Publication.find();
        if (publications) {
            return ({
                status: 'success',
                message: 'All Posts',
                payload: publications
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

//Afficher ses propres publications

const deleteYourPublication = (Publication) => async (idPostToDelete, reqAuthUserId) => {
    try {
        const publication = await Publication.findOne({ _id: idPostToDelete })
        if (!publication) {
            return ({
                status: "error",
                message: "this post does not exist!",
                payload: null
            })
        }
        else if (publication.userId !== reqAuthUserId) {
            return ({
                status: "error",
                message: "Unauthorized request!",
                payload: null
            })
        }
        else if (publication.userId === reqAuthUserId) {
            fs.unlink(publication.filePath, async () => {

                const deletePost = await Publication.deleteOne({ _id: idPostToDelete })
                if (!deletePost) {
                    return ({
                        status: "error",
                        message: "failed changes!",
                        payload: null
                    })

                } else {
                    return ({
                        status: "success",
                        message: "post deleted succesfully!",
                        payload: null
                    });

                }

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

//  const getNonFeaturedMovies = (Movie)=>async ()=>{
//     try {
//         const result = await Movie.find({'featured':false});
//         if(result){
//             return({
//                 status:'success',
//                 message:'All Non Featured Movies',
//                 payload: result
//             });
//         }    
//     } catch (error) {
//      return({
//          status:'fail',
//          message:'Sorry',
//          payload: error
//      });
//     }

//  }

//  const getFeaturedMovies = (Movie)=>async ()=>{
//     try {
//         const result = await Movie.find({'featured':true});
//         if(result){
//             return({
//                 status:'success',
//                 message:'All Featured Movies',
//                 payload: result
//             });
//         }    
//     } catch (error) {
//      return({
//          status:'fail',
//          message:'Sorry',
//          payload: error
//      });
//     }
//  }


module.exports = (Publication) => {
    return ({
        addNewPublication: addNewPublication(Publication),
        getOnePublicationById: getOnePublicationById(Publication),
        updateOnePublicationById: updateOnePublicationById(Publication),
        getAllPublications: getAllPublications(Publication),
        deleteYourPublication: deleteYourPublication(Publication)
        // getNonFeaturedMovies:getNonFeaturedMovies(Movie),
        // getFeaturedMovies:getFeaturedMovies(Movie)
    });
};