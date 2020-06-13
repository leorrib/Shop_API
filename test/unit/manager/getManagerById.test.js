const httpMock = require('node-mocks-http');
const mockManagerList = require('../../mock/manager/manager.data.json');
const controller = require('../../../controllers/manager.controller')
const model = require('../../../models/manager.model');
model.findById = jest.fn();
let req, res, next;

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})

afterEach(() => {
    model.findById.mockClear();
})

describe("Testing cotroller.getManagerById", () => {
    test("getManagerById function is defined", () => {
        expect(typeof(controller.getManagerById)).toBe("function")       
    })

    test("return a manager by id", async ()=> {
        req.params.manager_id = mockManagerList[0]._id;
        model.findById.mockReturnValue(mockManagerList[0]);
        await controller.getManagerById(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockManagerList[0]);
    })

    test("return 404 when an Id is not found", async ()=> {
        req.params.manager_id = mockManagerList[0]._id;
        model.findById.mockReturnValue(null);
        await controller.getManagerById(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(404);
    })

    test("return 500 when model.find throws an exception", async () => {
        req.params.manager_id = mockManagerList[1]._id;
        model.findById.mockRejectedValue("simulated exception");
        await controller.getManagerById(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("Please, provide a valid Id")
    })
    
})