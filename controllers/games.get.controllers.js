const app = require('../app')
const {allCategories, reviewsById} = require('../models/games.get.models')


const getCategories = (req, res, next) => {    
    allCategories().then((categories) => {
        res.status(200).send({categories})
    })
    .catch(err => {
        next(err)
    })
}

const getReviewsById = (req, res, next) => {
    const reviewId = req.params.review_id

        reviewsById(reviewId).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {getCategories, getReviewsById}