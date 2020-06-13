const request = require('supertest');
const app = require('../../../app')
const mongodb = require('../../../mongoDB/mongodb.utils')
const managerCreationData = require('../../mock/manager/creation.json')
const contactUrl = "/api/managers";

describe(`Negative scenarios on ${contactUrl}`, () => {

    beforeAll( async () => {
        await mongodb.connect();
    });

    beforeEach( async () => {
        await mongodb.deleteDatabase(`manager_${process.env.NODE_ENV}`);
    })

    afterAll( async () => {
        await mongodb.disconnect(); 
    });

    test(`Create a manager with insufficient data - POST ${contactUrl}`, async () => {
        let response = await request(app).post(contactUrl).send({
            name: managerCreationData[0],
            email: managerCreationData[0]
        });
        expect(response.statusCode).toBe(412);
        expect(response.body).toEqual("Please, fill all required fields")
    })

    test(`Create manager with email that already exists in the database - POST ${contactUrl}`, async () => {
        await request(app).post(contactUrl).send(managerCreationData[0]);
        
        let response = await request(app).post(contactUrl).send({
            name: managerCreationData[1].name,
            email: managerCreationData[0].email,
            password: managerCreationData[1].password
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual("Email already registered")
    })

    test(`Get a list of existing managers when none is registered - GET ${contactUrl}`, async()=> {
        let response = await request(app).get(contactUrl);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual("No managers in database")
    })

    test(`Get a manager by providing an Id that does not belong to any - GET ${contactUrl}`, async () => {
        let response = await request(app).get(`${contactUrl}/5ed97163e9cdfa0e888e18c2`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual("No managers with provided Id")
    })

    test(`Get a manager by providing an invalid Id - GET ${contactUrl}`, async () => {
        let response = await request(app).get(`${contactUrl}/5ed9`);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual("Please, provide a valid Id")
    })

    test(`Update manager info by providing an Id that does not belong to any - PUT ${contactUrl}`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);

        let responseLogin = await request(app).post(`${contactUrl}/login`).send({
            email: managerCreationData[0].email,
            password: managerCreationData[0].password
        });
        expect(responseLogin.statusCode).toBe(201);
        const token = responseLogin.header['auth-token'];

        let response = await request(app).put(`${contactUrl}/5ed97163e9cdfa0e888e18c2`)
        .set('auth-token', token)
        .send({name:'John'});
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe("Id not found");
    })

    test(`Delete manager by providing an Id that does not belong to any - DELETE ${contactUrl}`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);

        let responseDel = await request(app).delete(`${contactUrl}/5ed97163e9cdfa0e888e18c2`);
        expect(responseDel.statusCode).toBe(404);
        expect(responseDel.body).toBe("Manager not found");
    })

    test(`Login with incomplete info - POST ${contactUrl}/login`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        
        let responseLogin = await request(app).post(`${contactUrl}/login`).send( {email: managerCreationData[0].email });
        expect(responseLogin.statusCode).toBe(412);
        expect(responseLogin.body).toBe("Please, fill all required fields");
    })   

    test(`Login with invalid email - POST ${contactUrl}/login`, async () => {
        let responseLogin = await request(app).post(`${contactUrl}/login`).send({
            email: managerCreationData[0].email,
            password: managerCreationData[0].password
        });
        expect(responseLogin.statusCode).toBe(400);
        expect(responseLogin.body).toBe("Email not registered");
    })    

    test(`Login with incorrect password - POST ${contactUrl}/login`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        let responseLogin = await request(app).post(`${contactUrl}/login`).send({
            email: managerCreationData[0].email,
            password: managerCreationData[1].password
        });
        expect(responseLogin.statusCode).toBe(401);
        expect(responseLogin.body).toBe("Incorrect password");
    })    

})