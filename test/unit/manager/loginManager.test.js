const httpMock = require('node-mocks-http');
const controller = require('../../../controllers/manager.controller');
const model = require('../../../models/manager.model');
const pass = require('../../../security/crypt');
const schem = require('../../../models/manager.schema');
const token = require('../../../security/jwt.token');
const mockManager = require('../../mock/manager/creation.json');

model.create = jest.fn();
model.findOne = jest.fn();
pass.comparison = jest.fn();
token.securityToken = jest.fn();
schem.schemaManagerLogin.validate = jest.fn();
let req, res, next;

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    req.body = {...mockManager[0]};
})

afterEach(() => {
    model.create.mockClear();
    model.findOne.mockClear();
    pass.comparison.mockClear();
    token.securityToken.mockClear();
    schem.schemaManagerLogin.validate.mockClear();
})

describe("Testing cotroller.loginManager", () => {
    test("loginManager function is defined", async () => {
        expect(typeof(controller.loginManager)).toBe("function")       
    })

    test("valid user login", async () => {
        schem.schemaManagerLogin.validate.mockReturnValue(mockManager[0]);
        model.findOne.mockReturnValue(mockManager[0]);
        pass.comparison.mockReturnValue(true);
        token.securityToken.mockReturnValue("fakejwttoken");
        await controller.loginManager(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(mockManager[0]);
        expect(res._getHeaders()['auth-token']).toStrictEqual("fakejwttoken");
    })    

    test("login attempt with incomplete info", async () => {
        validation_error = { "error": "custom error"}
        schem.schemaManagerLogin.validate.mockReturnValue(validation_error);
        await controller.loginManager(req, res, next);
        expect(res.statusCode).toBe(412);
        expect(res._getJSONData()).toStrictEqual("Please, fill all required fields");
    })    

    test("no email found in database", async () => {
        schem.schemaManagerLogin.validate.mockReturnValue(mockManager[0]);
        model.findOne.mockReturnValue(false);
        await controller.loginManager(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual("Email not registered");
    })  

    test("wrong password", async () => {
        schem.schemaManagerLogin.validate.mockReturnValue(mockManager[0]);
        model.findOne.mockReturnValue(mockManager[0]);
        pass.comparison.mockReturnValue(false);
        await controller.loginManager(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toStrictEqual("Incorrect password");
    })   

    test("Exception", async () => {
        schem.schemaManagerLogin.validate.mockReturnValue(mockManager[0]);
        model.findOne.mockReturnValue(mockManager[0]);
        pass.comparison.mockReturnValue(true);
        token.securityToken.mockRejectedValue("failed token");
        await controller.loginManager(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("failed token");
    }) 
    
})