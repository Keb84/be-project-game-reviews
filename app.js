const express = require('express')

const {getCategories, getReviewsById, getUsers, getAllReviews, getCommentsByID} = require('./controllers/games.get.controllers')
const { patchReviewById } = require('./controllers/games.patch.controllers')
const {postCommentByID} = require('./controllers/games.post.controllers')
const {deleteCommentByID} = require('./controllers/games.delete.controllers')

const app = express()

app.use(express.json())



app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewsById)
app.get('/api/users', getUsers)
app.get('/api/reviews', getAllReviews)
app.get('/api/reviews/:review_id/comments', getCommentsByID)
app.patch('/api/reviews/:review_id', patchReviewById)
app.post('/api/reviews/:review_id/comments', postCommentByID)
app.delete('/api/comments/:comment_id', deleteCommentByID)

app.all('*', (req, res, next) => {
    res.status(404).send({
        msg : 'Path not found!'
    })
})

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg : err.msg});
    }else next (err)
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({ msg : 'Bad request'})
    }else next (err)
})

app.use((err, req, res, next) => {
    if(err.code === '23502'){
        res.status(400).send({msg : 'Bad request'})
    }
})

app.use((err, req, res, next) => {  
res.status(500).send({ msg : 'Internal Server Error!'}) 
})


module.exports = app