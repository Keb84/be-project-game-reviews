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

exports.allReviews = (category) => {
    

        
    let queryStr = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count FROM reviews JOIN comments ON reviews.review_id = comments.review_id `;
       
    const queryValues = []

    if (category){
        queryStr += `WHERE category=$1 `;
        queryValues.push(category)
    }
    queryStr += `GROUP BY reviews.review_id ORDER BY created_at DESC;`    
    
    return db.query(queryStr, queryValues).then((result) => {

        if(result.rows.length === 0){
            return Promise.reject({
                status : 400,
                msg: 'Oops that category doesn"t exist'
            })
        }
        
        return result.rows
    })

    }
exports.allComments = (review_id) => {
 
    return db.query('SELECT reviews.review_id FROM reviews WHERE review_id = $1;', [review_id]).then((result) => {
        const review = result.rows[0]
               
        if(!review){
            return Promise.reject({
                status : 404,
                msg : 'review Id not found'
            })
        }else {
            return review
        }
    }).then(()=> {       
             
        return db.query('SELECT * FROM comments WHERE review_id = $1;', [review_id]).then((result) => {
            const review = result.rows
            return review
        })
    })
            
        
    }        
    

        
            
            
        
        
        
             
    
