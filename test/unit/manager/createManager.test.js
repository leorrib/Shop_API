const httpMock = require('node-mocks-http');
const controller = require('../../../controllers/manager.controller');
const schem = require('../../../models/manager.schema');
const mockManagerList = require('../../mock/manager/manager.data.json')
const pass = require('../../../security/crypt')
const model = require('../../../models/manager.model');

model.findOne = jest.fn();
model.create = jest.fn();
pass.encrypter = jest.fn();
schem.schemaManager.validate = jest.fn();
let req, res, next;

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    req.body = {...mockManagerList[0]};
})

afterEach(() => {
    model.findOne.mockClear();
    model.create.mockClear();
    pass.encrypter.mockClear();
    schem.schemaManager.validate.mockClear();
})

describe("Testing controller.createManager", () => {
    test("createManager function is defined", () => {
        expect(typeof(controller.createManager)).toBe("function")       
    })

    test("create a valid manager", async () => {
        schem.schemaManager.validate.mockReturnValue(mockManagerList[0]);
        model.create.mockReturnValue(mockManagerList[0]);
        model.findOne.mockReturnValue(false);
        pass.encrypter.mockReturnValue("fakeEncryptedPassword");
        await controller.createManager(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(mockManagerList[0])
        expect(model.create).toBeCalledWith({...mockManagerList[0], password: "fakeEncryptedPassword"});
    });

    test("attempt to create a manager that is already registered", async () => {
        schem.schemaManager.validate.mockReturnValue(mockManagerList[0]);
        model.findOne.mockReturnValue(true);
        await controller.createManager(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual("Email already registered");
    })

    test("Attempt to create a manager with not enough info", async () => {
        const validation_error = { "error": "custom error" }
        schem.schemaManager.validate.mockReturnValue(validation_error);
        await controller.createManager(req, res, next);
        expect(res.statusCode).toBe(412);
        expect(res._getJSONData()).toStrictEqual("Please, fill all required fields");
    })

    test("Failed encrypted password password", async () => {
        schem.schemaManager.validate.mockReturnValue(mockManagerList[0]);
        model.findOne.mockReturnValue(false);
        pass.encrypter.mockRejectedValue("failed hash");
        await controller.createManager(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("failed hash");
    })
})