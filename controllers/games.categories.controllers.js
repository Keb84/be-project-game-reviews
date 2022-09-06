const app = require('../app')
const {allCategories} = require('../models/games.categories.models')


const getCategories = (req, res, next) => {
    
    allCategories().then((categories) => {
        res.status(200).send({categories})
    })
    .catch(err => {
        next(err)
    })
}

module.exports = {getCategories}