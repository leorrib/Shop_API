const request = require('supertest');
const app = require('../../../app')
const endpointUrl = "/api";

describe(`Validate ${endpointUrl}`, () => {

    test("Get / ", async () => {
        const response = await request(app).get('/');
        console.log(response.body);
        expect(response.body).toEqual("Welcome to our Store")
        expect(response.statusCode).toBe(200);
    })

    test(`Get ${endpointUrl}`, async () => {
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("status", 'Our shop is open!')
    })
})