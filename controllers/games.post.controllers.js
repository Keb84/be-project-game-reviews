const {addComment} = require('../models/games.post.models')

const postCommentByID = (req, res, next) => {
    const {review_id} = req.params
    const {username} = req.body
    const {body} = req.body

    
addComment(review_id, username, body).then((comment) => {
    res.status(201).send({comment})
})
.catch(err => {
    next(err)
})

}

module.exports = {postCommentByID}