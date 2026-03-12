import { sendSuccess, sendError } from '../../utils/response.util';
import { Response } from 'express';

describe('Response Utility', () => {
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockResponse = {
            status: mockStatus,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendSuccess', () => {
        test('1. should send success with default status code 200', () => {
            sendSuccess(mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true });
        });

        test('2. should send success with custom status code', () => {
            sendSuccess(mockResponse as Response, undefined, 201);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({ success: true });
        });

        test('3. should send success with data', () => {
            const data = { id: 1, name: 'Test' };
            sendSuccess(mockResponse as Response, data);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true, data });
        });

        test('4. should send success with message', () => {
            sendSuccess(mockResponse as Response, undefined, 200, 'Operation successful');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true, message: 'Operation successful' });
        });

        test('5. should send success with data and message', () => {
            const data = { user: 'admin' };
            sendSuccess(mockResponse as Response, data, 201, 'Created');
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({ success: true, data, message: 'Created' });
        });

        test('6. should send success with null data', () => {
            sendSuccess(mockResponse as Response, null);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true, data: null });
        });

        test('7. should return the response object', () => {
            const result = sendSuccess(mockResponse as Response);
            expect(result).toBeDefined();
        });
    });

    describe('sendError', () => {
        test('8. should send error with default status code 500', () => {
            sendError(mockResponse as Response, 'Server Error');
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ success: false, message: 'Server Error' });
        });

        test('9. should send error with custom status code', () => {
            sendError(mockResponse as Response, 'Not Found', 404);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ success: false, message: 'Not Found' });
        });

        test('10. should send error with issues object', () => {
            const issues = { field: 'email', reason: 'invalid' };
            sendError(mockResponse as Response, 'Validation Failed', 422, issues);
            expect(mockStatus).toHaveBeenCalledWith(422);
            expect(mockJson).toHaveBeenCalledWith({ success: false, message: 'Validation Failed', issues });
        });

        test('11. should send error with issues string array', () => {
            const issues = ['Error 1', 'Error 2'];
            sendError(mockResponse as Response, 'Multiple Errors', 400, issues);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ success: false, message: 'Multiple Errors', issues });
        });

        test('12. should return the response object on error', () => {
            const result = sendError(mockResponse as Response, 'Test Error');
            expect(result).toBeDefined();
        });
    });
});
