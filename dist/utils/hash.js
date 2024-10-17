"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash256 = exports.hash160 = exports.hash = exports.sha256 = exports.ripemd160 = void 0;
const createHash = require("create-hash");
const ripemd160 = (data) => {
    return createHash("ripemd160").update(data).digest();
};
exports.ripemd160 = ripemd160;
const sha256 = (data) => {
    return createHash("sha256").update(data).digest();
};
exports.sha256 = sha256;
const hash = (...params) => {
    const _hash = createHash("sha256");
    params.forEach((value) => {
        _hash.update(value);
    });
    return createHash("sha256").update(_hash.digest()).digest();
};
exports.hash = hash;
const hash160 = (data) => {
    return (0, exports.ripemd160)((0, exports.sha256)(data));
};
exports.hash160 = hash160;
const hash256 = (data) => {
    return (0, exports.sha256)((0, exports.sha256)(data));
};
exports.hash256 = hash256;
