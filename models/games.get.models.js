const db = require('../db/connection')

exports.allCategories = () => {
    
    return db.query('SELECT * FROM categories').then((result) => {
        return result.rows 
               
    })
}

exports.reviewsById = (review_id) => {   

    return db.query('SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;', [review_id]).then((result) => {

        const review = result.rows[0]
        
        if(!review){
            return Promise.reject({
                status : 404,
                msg : 'review Id not found'
            })
        }
        return review
    })
    

        }

exports.allUsers = () => {
    return db.query('SELECT * FROM users').then((result) => {
        
        return result.rows
    })
    
}
