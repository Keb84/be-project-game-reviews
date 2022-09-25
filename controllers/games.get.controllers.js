const app = require('../app')
const {allCategories, reviewsById, allUsers, allReviews, allComments} = require('../models/games.get.models')


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

const getUsers = (req, res, next) => {
    allUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}
const getAllReviews = (req, res, next) => {
    const {sort_by, order, category} = req.query
    allReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(err => {
        next(err)
    })
}
const getCommentsByID = (req, res, next) => {
    const reviewId = req.params.review_id    
    allComments(reviewId).then((comments) => {
        
        res.status(200).send({comments})  
    })
    .catch(err => {
        next(err)
    })
}


module.exports = {getCategories, getReviewsById, getUsers, getAllReviews, getCommentsByID}