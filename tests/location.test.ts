import request from 'supertest'
import app from '../app'

describe('Locatio Apis', () => {
    // Check that 
    it('should return data with object with key', () => {
        return request(app)
            .get('/location/131.38.117.201')
            .expect(200)
            .then(response => {

                expect(response.body).toMatchObject({
                    data: {
                        range: expect.any(Array),
                        country: expect.any(String),
                        region: expect.any(String),
                        eu: expect.any(String),
                        timezone: expect.any(String),
                        city: expect.any(String),
                        ll: expect.any(Array),
                        metro: expect.any(Number),
                        area: expect.any(Number)
                    },
                })
            })
    })

    it('should return 404 error', () => {
        return request(app)
            .get("/location/")
            .expect(404)
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({})
                )
            })
    })
})