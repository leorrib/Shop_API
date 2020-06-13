const request = require('supertest');
const app = require('../../../app')
const mongodb = require('../../../mongoDB/mongodb.utils')
const managerCreationData = require('../../mock/manager/creation.json')
const contactUrl = "/api/managers";

describe(`Positive scenarios on ${contactUrl}`, () => {

    beforeAll( async () => {
        await mongodb.connect();
    });

    beforeEach( async () => {
        await mongodb.deleteDatabase(`manager_${process.env.NODE_ENV}`);
    })

    afterAll( async () => {
        await mongodb.disconnect(); 
    });

    test(`Create manager - POST ${contactUrl}`, async () => {
        let response = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("name", managerCreationData[0].name);
        expect(response.body).toHaveProperty("email", managerCreationData[0].email);
        expect(response.body).toHaveProperty("password");
        expect(response.body).toHaveProperty("admission_date");
        expect(response.body).toHaveProperty("__v");
        expect(Object.keys(response.body).length).toEqual(6);
    })

    test(`Get manager data by Id - GET ${contactUrl}`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        
        let responseGet = await request(app).get(`${contactUrl}/${responseCreate.body._id}`);
        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body).toHaveProperty("_id");
        expect(responseGet.body).toHaveProperty("name", managerCreationData[0].name);
        expect(responseGet.body).toHaveProperty("email", managerCreationData[0].email);
        expect(responseGet.body).toHaveProperty("password");
        expect(responseGet.body).toHaveProperty("admission_date");
        expect(responseGet.body).toHaveProperty("__v")
        expect(Object.keys(responseGet.body).length).toEqual(6);
    })

    test(`Get managers list - GET ${contactUrl}`, async()=> {
        await request(app).post(contactUrl).send(managerCreationData[0]);
        await request(app).post(contactUrl).send(managerCreationData[1]);

        let response = await request(app).get(contactUrl);
        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).length).toBeGreaterThan(0); 
        console.log(response.body);
    })

    test(`Delete manager data by Id - DELETE ${contactUrl}`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        
        let responseDel = await request(app).delete(`${contactUrl}/${responseCreate.body._id}`);
        expect(responseDel.statusCode).toBe(200);
    })

    test(`Login with a Manager - POST ${contactUrl}/login`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        
        let login_json = { "email": managerCreationData[0].email, "password": managerCreationData[0].password }
        let responseLogin = await request(app).post(`${contactUrl}/login`).send(login_json);
        expect(responseLogin.statusCode).toBe(201);
        expect(responseLogin.header['auth-token']).toBeTruthy;
    })    

    test(`Update manager by Id - PUT ${contactUrl}`, async () => {
        let responseCreate = await request(app).post(contactUrl).send(managerCreationData[0]);
        expect(responseCreate.statusCode).toBe(201);
        
        let login_json = { "email": managerCreationData[0].email, "password": managerCreationData[0].password }
        let responseLogin = await request(app).post(`${contactUrl}/login`).send(login_json);
        expect(responseLogin.statusCode).toBe(201);
        const authToken = responseLogin.header['auth-token'];
        
        const responseUp = await request(app).put(`${contactUrl}/${responseCreate.body._id}`)
        .set('auth-token', authToken).send({name:'John'});
        expect(responseUp.statusCode).toBe(201);
        
        let responseGet = await request(app).get(`${contactUrl}/${responseUp.body._id}`);
        expect(responseGet.statusCode).toBe(200);
        expect(responseGet.body.name).toEqual('John')
    })

})