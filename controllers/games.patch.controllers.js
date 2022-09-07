
const {updateVotes} = require('../models/games.patch.models')


const patchReviewById = (req, res, next) => {
    const reviewId = req.params.review_id
    const voteUpdate = req.body
    console.log(voteUpdate)
  
    updateVotes(reviewId, voteUpdate).then((review) => {
        res.status(200).send({review})
    })
    .catch(err => {
        console.log(err)
        next(err)
    })
}

module.exports = {patchReviewById}