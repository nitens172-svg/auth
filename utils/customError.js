class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

 export class BadRequestError extends ApiError {

    constructor(message = "Bad Request") {
        super(message, 400);
    }
}


export class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(message, 404);      
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class InternalServerError extends ApiError {
    constructor(message = "Internal Error") {
        super(message, 500);
    }
}

export class conflictError extends ApiError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

export class validationError extends ApiError {
    constructor(message = "Validation Error") {
        super(message, 400);
    }
}

export class databaseError extends ApiError {
    constructor(message = "Database Error") {
        super(message, 500);
    }  
}
