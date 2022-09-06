const db = require('../db/connection')

exports.allCategories = () => {
    
    return db.query('SELECT * FROM categories').then((result) => {
        return result.rows 
               
    })
}

exports.reviewsById = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id=$1;', [review_id]).then((result) => {
        const review = result.rows[0]
        if(!review){
            return Promise.reject({
                status: 404,
                msg: 'review Id not found'
            })
        }       
        return review
    })
}

