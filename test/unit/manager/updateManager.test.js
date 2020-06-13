const httpMock = require('node-mocks-http');
const mockManagerList = require('../../mock/manager/manager.data.json')
const controller = require('../../../controllers/manager.controller');
const model = require('../../../models/manager.model');
model.findByIdAndUpdate = jest.fn();
let req, res, next;

beforeEach( () => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})

afterEach( () => {
    model.findByIdAndUpdate.mockClear();
})

describe("Testing cotroller.updateManagerById", () => {
    test("updateManagerById function is defined", () => {
        expect(typeof(controller.updateManagerById)).toBe("function")       
    })

    test("update a manager by id", async ()=> {
        let UpdatedInfo = {...mockManagerList[1], phone: "09876"}
        req.params.manager_id = mockManagerList[1]._id;
        req.body = {...UpdatedInfo};
        model.findByIdAndUpdate.mockReturnValue(UpdatedInfo);
        await controller.updateManagerById(req, res, next);
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
            req.params.manager_id, 
            req.body, 
            {"useFindAndModify": false});
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(UpdatedInfo);
    })

    test("return 400 when an Id is not found", async ()=> {
        model.findByIdAndUpdate.mockReturnValue(null);
        await controller.updateManagerById(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toBeNull;
    })

    test("return 500 when model.findByIdAndUpdate throws an exception", async () => {
        model.findByIdAndUpdate.mockRejectedValue("simulated exception");
        await controller.updateManagerById(req, res, next);
        expect(res.statusCode).toBe(500);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual("simulated exception")
    })
    
})