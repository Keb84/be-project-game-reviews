const { bindComplete } = require('pg-protocol/dist/messages')
const db = require('../db/connection')
const categories = require('../db/data/test-data/categories')

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

exports.allReviews = (sort_by = 'created_at', order = 'desc' , category) =>   { 
    if(!['title', 'designer', 'owner', 'review_img_url', 'category', 'created_at', 'votes', 'comment_count'].includes(sort_by)){
        
        return Promise.reject({
            status : 400, 
            msg : 'Sorry cannot sort by by that query'
        })
    }else if(!['asc', 'ASC', 'desc', 'DESC'].includes(order)){
        return Promise.reject({
            status : 400,
            msg: 'Sorry cannot order by that query'
        })
    }
    
       
    let categoriesArr = []
    let categoriesStr = `SELECT slug FROM categories`
    return db.query(categoriesStr).then((catResult) => {
        
        
       const slugArr = catResult.rows.map((slug) => {
            return slug.slug
        })        
        categoriesArr = [...slugArr]                
    }).then((res) => {
        
        
        let queryStr = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id `;
        
        const queryValues = []        
        if (category){
            queryValues.push(category)
            queryStr += `WHERE category=$${queryValues.length} `;
        }
        queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`           
        
        
    return db.query(queryStr, queryValues)
    }).then((result) => {
    if(category){
        
        if(!categoriesArr.includes(category)){
            return Promise.reject({
                status : 404,
                msg: 'Oops that category can"t be found'
            })
        }
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
    

        
            
            
        
        
        
             
    
