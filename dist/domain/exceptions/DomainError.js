"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DomainError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.DomainError = DomainError;
