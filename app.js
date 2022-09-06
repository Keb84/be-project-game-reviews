const express = require('express')

const {getCategories} = require('./controllers/games.categories.controllers')

const app = express()



app.get('/api/categories', getCategories)

app.all('*', (req, res, next) => {
    res.status(404).send({
        msg : 'Path not found!'
    })
})

app.use((err, req, res, next) => {  
res.status(500).send({ msg : 'Internal Server Error!'}) 
})




module.exports = app