const express = require('express')

const {getCategories, getReviewsById} = require('./controllers/games.get.controllers')

const app = express()



app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewsById)

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
res.status(500).send({ msg : 'Internal Server Error!'}) 
})


module.exports = app