const httpMock = require('node-mocks-http');
const mockManagerList = require('../../mock/manager/manager.data.json')
const controller = require('../../../controllers/manager.controller');
const model = require('../../../models/manager.model');
model.findByIdAndDelete = jest.fn();
let req, res, next;

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
})

afterEach(() => {
    model.findByIdAndDelete.mockClear();
})

describe("Testing cotroller.deleteEmployeeById", () => {
    test("deleteEmployeeById function is defined", () => {
        expect(typeof(controller.deleteManagerById)).toBe("function")       
    })

    test("delete a manager by id", async ()=> {
        req.params.manager_id = mockManagerList[0]._id;
        model.findByIdAndDelete.mockReturnValue(mockManagerList[0]);
        await controller.deleteManagerById(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockManagerList[0]);
    })

    test("return 404 when an Id is not found", async ()=> {
        req.params.manager_id = mockManagerList[1]._id;
        model.findByIdAndDelete.mockReturnValue(null);
        await controller.deleteManagerById(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(404);
    })

    test("return 500 when model.find throws an exception", async () => {
        req.params.manager_id = mockManagerList[1]._id;
        model.findByIdAndDelete.mockRejectedValue("simulated exception");
        await controller.deleteManagerById(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.manager_id);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("simulated exception")
    })
    
})