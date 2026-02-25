import { Response } from "express";

/**
 * Standard API response types
 */
export interface SuccessResponse<T = unknown> {
    success: true;
    data?: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    issues?: unknown;
}

/**
 * Send a success response
 */
export function sendSuccess<T>(
    res: Response,
    data?: T,
    statusCode: number = 200,
    message?: string
): Response {
    const response: SuccessResponse<T> = {
        success: true,
        ...(data !== undefined && { data }),
        ...(message && { message }),
    };
    return res.status(statusCode).json(response);
}

/**
 * Send an error response
 */
export function sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    issues?: unknown
): Response {
    const response: ErrorResponse = {
        success: false,
        message,
    };
    if (issues !== undefined) {
        response.issues = issues;
    }
    return res.status(statusCode).json(response);
}
