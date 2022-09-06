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
            expect(res.body.reviews).toHaveProperty('review_id', 10)
            expect(res.body.reviews).toHaveProperty('title', 'Build you own tour de Yorkshire')
            expect(res.body.reviews).toHaveProperty('designer', 'Asger Harding Granerud')
            expect(res.body.reviews).toHaveProperty('owner', 'mallionaire')
            expect(res.body.reviews).toHaveProperty('review_img_url', 'https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
            expect(res.body.reviews).toHaveProperty('review_body', 'Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ')
            expect(res.body.reviews).toHaveProperty( 'category', 'social deduction')
            expect(res.body.reviews).toHaveProperty( 'created_at', '2021-01-18T10:01:41.251Z')
            expect(res.body.reviews).toHaveProperty( 'votes', 10)            
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
    describe('GET /api/users', () => {
        it('should respond with a status 200 and an array of user objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((res) => {
                const users = res.body.users

                expect(Array.isArray(users)).toBe(true)
                expect(users.length > 0).toBe(true)
                users.forEach((users) => {
                    expect(users).toHaveProperty('username', expect.any(String))
                    expect(users).toHaveProperty('name', expect.any(String))
                    expect(users).toHaveProperty('avatar_url', expect.any(String))
                })

            })
        })
        it('should respond with status 404 : path not found when passed an incorrect path ', () => {
            return request(app)
            .get('/api/users123')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Path not found!')
            })
        });
    })
})
               
                
            
            
              
                
                