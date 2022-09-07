const db = require('../db/connection')


const updateVotes = (review_id, newInfo) => {

    const {inc_votes} = newInfo
    
   
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING *;', [inc_votes, review_id]).then((result) => {
        
        const review =  result.rows[0]
        console.log(review)
        if(!review){
            return Promise.reject({
                status : 404,
                msg: 'review Id not found'
            })
        }
        return review
    })
}
module.exports = {updateVotes}