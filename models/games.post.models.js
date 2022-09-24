const db = require('../db/connection')

exports.addComment = (review_id, username, body) => {

        if(!body || !username){
            return Promise.reject({
                status : 400,
                msg : 'You must include both a username and comment in your post'
            })
        }

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
    }).then(() => {

        
        return db.query(`SELECT username FROM users WHERE username=$1`, [username]).then((result) => {
            
            const user = result.rows;
            if(user.length <1) {
                return Promise.reject({
                    status : 422,
                    msg : "Sorry that username doesn't exist"
                })
            }
        })
    })
    .then(() => {
        let queryString = `INSERT INTO comments (review_id, author, body, votes) VALUES ($1, $2, $3, 0) RETURNING *`
        
        return db.query(queryString, [review_id, username, body])
    })
    .then((result) => {
        const post = result.rows[0]
        return post
    })

}

