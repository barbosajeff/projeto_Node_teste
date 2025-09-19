"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const http_status_codes_1 = require("http-status-codes");
const validation = (schemas) => async (req, res, next) => {
    const erroResult = {};
    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key], { abortEarly: false });
        }
        catch (err) {
            const yupError = err;
            const errors = {};
            yupError.inner.forEach((error) => {
                if (!error.path)
                    return;
                errors[error.path] = error.message;
            });
            erroResult[key] = errors;
        }
    });
    if (Object.entries(erroResult).length === 0) {
        return next();
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: erroResult });
    }
};
exports.validation = validation;
