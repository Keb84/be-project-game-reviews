const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})



describe('GET requests', () => {
    describe('GET /api/categories', () => {
        it('should respond with a status 200 and an array of category objects', () => {
            return request(app)
            .get('/api/categories')
            .expect(200)
            .then((res) => {
                const categories = res.body.categories
                
                expect(Array.isArray(categories)).toBe(true)
                expect(categories.length > 0).toBe(true) 
                categories.forEach((categories) => {
                    expect(categories).toHaveProperty('slug', expect.any(String))
                    expect(categories).toHaveProperty('description', expect.any(String))
                })              
            })
        });
        it('should respond with status 404 : path not found when passed an incorrect path', () => {
            return request(app)
            .get('/api/categories123')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Path not found!')
            })
        });
    describe('GET /api/reviews/:review_id', () => {
        it('should respond with a status 200 and a review object', () => {
            const reviewId = 10
            return request(app)
            .get(`/api/reviews/${reviewId}`)
            .expect(200)
            .then((res) => {                            
            expect(res.body.reviews).toHaveProperty('review_id', expect.any(Number))
            expect(res.body.reviews).toHaveProperty('title', expect.any(String))
            expect(res.body.reviews).toHaveProperty('designer', expect.any(String))
            expect(res.body.reviews).toHaveProperty('owner', expect.any(String))
            expect(res.body.reviews).toHaveProperty('review_img_url', expect.any(String))
            expect(res.body.reviews).toHaveProperty('review_body', expect.any(String))
            expect(res.body.reviews).toHaveProperty( 'category', expect.any(String))
            expect(res.body.reviews).toHaveProperty( 'created_at', expect.any(String))
            expect(res.body.reviews).toHaveProperty( 'votes', expect.any(Number))            
        })
    });
        it('should respond with a status 400 : bad request', () => {
            const reviewId = 'banana'
            return request(app)
            .get(`/api/reviews/${reviewId}`)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request')
            })
        });
        it('responds with a custom 404 status if thevrequest was good but the review_id doesn"t exist', () => {
            const reviewId = '20'
            return request(app)
            .get(`/api/reviews/${reviewId}`)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('review Id not found')
            })
        });
})
})
})
               
                
            
            
              
                
                