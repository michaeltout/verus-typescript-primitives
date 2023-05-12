"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const varint_1 = require("../utils/varint");
const varuint_1 = require("../utils/varuint");
const address_1 = require("../utils/address");
const bufferutils_1 = require("../utils/bufferutils");
const bn_js_1 = require("bn.js");
const { BufferReader, BufferWriter } = bufferutils_1.default;
class CurrencyValueMap {
    constructor(data = {}) {
        this.value_map = new Map(data.value_map || []);
        this.multivalue = !!(data.multivalue);
    }
    getNumValues() {
        return new bn_js_1.BN(this.value_map.size, 10);
    }
    getByteLength() {
        let byteLength = 0;
        if (this.multivalue) {
            byteLength += varuint_1.default.encodingLength(this.value_map.size);
        }
        for (const [key, value] of this.value_map) {
            byteLength += 20;
            byteLength += this.multivalue ? 8 : varint_1.default.encodingLength(value);
        }
        return byteLength;
    }
    toBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.getByteLength()));
        if (this.multivalue) {
            bufferWriter.writeCompactSize(this.value_map.size);
        }
        for (const [key, value] of this.value_map) {
            const { hash } = (0, address_1.fromBase58Check)(key);
            bufferWriter.writeSlice(hash);
            if (this.multivalue)
                bufferWriter.writeInt64(value);
            else
                bufferWriter.writeVarInt(value);
        }
        return bufferWriter.buffer;
    }
    fromBuffer(buffer, offset) {
        const bufferReader = new BufferReader(buffer, offset);
        let count;
        if (this.multivalue) {
            count = bufferReader.readCompactSize();
        }
        else {
            count = 1;
        }
        for (let i = 0; i < count; i++) {
            const hash = bufferReader.readSlice(20);
            const value = this.multivalue ? bufferReader.readInt64() : bufferReader.readVarInt();
            const base58Key = (0, address_1.toBase58Check)(hash, 102);
            this.value_map.set(base58Key, value);
        }
        return offset;
    }
}
exports.default = CurrencyValueMap;
