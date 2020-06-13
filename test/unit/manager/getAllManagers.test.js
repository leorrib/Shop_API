const httpMock = require('node-mocks-http');
const mockManagerList = require('../../mock/manager/manager.data.json')
const controller = require('../../../controllers/manager.controller');
const model = require('../../../models/manager.model');
model.find = jest.fn();
let req, res, next;

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})

afterEach(() => {
    model.find.mockClear();
})

describe("Testing cotroller.getManagersList", () => {
    test("getManagersList function is defined", () => {
        expect(typeof(controller.getManagersList)).toBe("function")       
    })

    test("return all managers", async ()=> {
        model.find.mockReturnValue(mockManagerList);
        await controller.getManagersList(req, res, next);
        console.log(res._getJSONData())
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockManagerList);
    })

    test("return 404 when the database is empty", async ()=> {
        model.find.mockReturnValue(null);
        await controller.getManagersList(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    test("return 500 when model.findById throws an exception", async () => {
        model.find.mockRejectedValue("simulated exception");
        await controller.getManagersList(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("simulated exception");
    })
    
})