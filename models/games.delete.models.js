const db = require('../db/connection')

const removeComment = (comment_id) => {

    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id]).then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({
                status : 404, 
                msg : 'Sorry that comment id doesn"t exist'
            })
        }
        
    })
}

module.exports= {removeComment}