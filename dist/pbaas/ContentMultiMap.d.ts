/// <reference types="bn.js" />
/// <reference types="node" />
import { VdxfUniValue, VdxfUniValueJson } from './VdxfUniValue';
export declare const IDENTITY_VERSION_PBAAS: import("bn.js");
export declare const VERSION_INVALID: import("bn.js");
export declare type ContentMultiMapPrimitive = VdxfUniValue | Buffer;
export declare type ContentMultiMapPrimitiveJson = VdxfUniValueJson | string;
export declare type ContentMultiMapJsonValue = ContentMultiMapPrimitiveJson | Array<ContentMultiMapPrimitiveJson>;
export declare type ContentMultiMapJson = {
    [key: string]: ContentMultiMapJsonValue;
};
export declare type KvValueArrayItem = Buffer | ContentMultiMapJson;
export declare function isKvValueArrayItemVdxfUniValueJson(x: ContentMultiMapJsonValue): x is VdxfUniValueJson;
export declare type KvContent = Map<string, Array<ContentMultiMapPrimitive> | ContentMultiMapPrimitive>;
export declare class ContentMultiMap {
    kv_content: KvContent;
    constructor(data?: {
        kv_content: KvContent;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    static fromJson(obj: {
        [key: string]: ContentMultiMapJsonValue;
    }): ContentMultiMap;
    toJson(): ContentMultiMapJson;
}