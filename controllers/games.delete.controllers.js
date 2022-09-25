const {removeComment} = require('../models/games.delete.models')

const deleteCommentByID = (req, res, next) => {
    const {comment_id} = req.params;
    removeComment(comment_id).then((response) => {
        res.status(204).send(response)
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {deleteCommentByID}