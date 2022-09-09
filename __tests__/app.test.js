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
    })
    describe('GET /api/reviews/:review_id', () => {
        it('should respond with a status 200 and a review object', () => {
            const reviewId = 2
            return request(app)
            .get(`/api/reviews/${reviewId}`)
            .expect(200)
            .then((res) => {                            
            expect(res.body.reviews).toHaveProperty('review_id', 2)
            expect(res.body.reviews).toHaveProperty('title', 'Jenga')
            expect(res.body.reviews).toHaveProperty('designer', 'Leslie Scott')
            expect(res.body.reviews).toHaveProperty('owner', 'philippaclaire9')
            expect(res.body.reviews).toHaveProperty('review_img_url','https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
            expect(res.body.reviews).toHaveProperty('review_body', 'Fiddly fun for all the family')
            expect(res.body.reviews).toHaveProperty( 'category', 'dexterity')
            expect(res.body.reviews).toHaveProperty( 'created_at',  '2021-01-18T10:01:41.251Z')
            expect(res.body.reviews).toHaveProperty( 'votes', 5)  
            expect(res.body.reviews).toHaveProperty('comment_count', 3)          
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
        it('responds with a custom 404 status if the request was good but the review_id doesn"t exist', () => {
            const reviewId = '20'
            return request(app)
            .get(`/api/reviews/${reviewId}`)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('review Id not found')
            })
        });
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
    describe('GET /api/reviews/:review_id', () => {
        it('should respond with 200 and a response object that contains a comment_count key', () => {
            return request(app)
            .get('/api/reviews/3')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toEqual({
                    review_id: 3,
                    title: 'Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface',
                    review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: "We couldn't find the werewolf!",
                    category: 'social deduction',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5,
                    comment_count : 3
                })
            })
        });
    })
    describe('GET /api/reviews', () => {
        it('should responds with 200 and an array of review objects sorted in date order', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toBeSortedBy('created_at', {descending:true})
                expect(body.reviews.length > 0).toBe(true)
                body.reviews.forEach((review) => {
                    expect(review).toHaveProperty('review_id',expect.any(Number))
                    expect(review).toHaveProperty('title',expect.any(String))
                    expect(review).toHaveProperty('designer',expect.any(String))
                    expect(review).toHaveProperty('owner',expect.any(String))
                    expect(review).toHaveProperty('review_img_url',expect.any(String))
                    expect(review).toHaveProperty('category',expect.any(String))
                    expect(review).toHaveProperty('created_at',expect.any(String))
                    expect(review).toHaveProperty('votes',expect.any(Number))
                    expect(review).toHaveProperty('comment_count',expect.any(Number))
                })
            })            
        });
                  

                    
        it('should respond with 200 and a response object filtered by a passed category query', () => {
            return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({body}) => {
                expect(body.reviews.length).toBe(1)
                expect(body.reviews.every(review => review.category === 'dexterity')).toBe(true)
                expect()

            })
        });
        it('should respond with a custom 404 status if the request was good but the category doesn"t exist', () => {
            return request(app)
            .get('/api/reviews?category=bananas')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Oops that category can"t be found')
            })
        });
        it('respond with 200 and an empty array when the category is valid but there are no instances of it', () => {
            return request(app)
            .get("/api/reviews?category=children's+games")
            .expect(200)
            .then(({body}) => {
                expect(body.reviews).toEqual([])
            })
        });

    })
    
})

describe('PATCH request', () => {
    describe('PATCH /api/reviews/:review_id', () => {
        it('should respond with a status 200 and the updated review object ', () => {
            const reviewUpdate = {
                inc_votes : 10
            }
            return request(app)
            .patch('/api/reviews/1')
            .send(reviewUpdate)
            .expect(200)
            .then(({body}) => {
                expect(body.review).toEqual({
                    review_id: 1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: '2021-01-18T10:00:20.514Z',
                    votes: 11
            
                })
            })
        })
        it('should respond with status 404 : path not found when passed an incorrect path', () => {
            return request(app)
            .patch('/api/reviews123/3')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Path not found!')
            })
        });
        it('should respond with status 400 : bad request when passed an incorrect reviewId', () => {
            return request(app)
            .patch('/api/reviews/banana')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request')
            })
        });
        it('responds with a custom 404 status if the request was good but the review_id doesn"t exist', () => {
            const reviewId = '20'
            return request(app)
            .patch(`/api/reviews/${reviewId}`)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('review Id not found')
            })
        });
        it('should respond with status 400 : bad request when the request body is empty', () => {
            const reviewUpdate = { }
            return request(app)
            .patch('/api/reviews/1')
            .send(reviewUpdate)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request')
            })
        });
        it('should respond with a 400: bad request when the request body has an invalid value ', () => {
            const reviewUpdate = {
                inc_votes : "cat"
            }
            return request(app)
            .patch('/api/reviews/1')
            .send(reviewUpdate)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request')
            })
        });
    })
})
            
               
                
            
            
              
                
                