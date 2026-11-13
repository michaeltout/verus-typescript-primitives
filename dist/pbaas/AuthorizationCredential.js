"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationStorageKeyCredential = exports.AuthorizationStorageBindingCredential = exports.AuthorizationCredential = void 0;
exports.deriveAppAuthorizationStorageManifest = deriveAppAuthorizationStorageManifest;
exports.verifyAppAuthorizationStorageManifest = verifyAppAuthorizationStorageManifest;
const keys_1 = require("../vdxf/keys");
const validation_1 = require("../utils/validation");
const serialization_1 = require("../utils/serialization");
const varuint_1 = require("../utils/varuint");
const address_1 = require("../utils/address");
const vdxf_1 = require("../constants/vdxf");
const bn_js_1 = require("bn.js");
const hash_1 = require("../utils/hash");
const Credential_1 = require("./Credential");
function version(value, first, last) {
    if (!bn_js_1.BN.isBN(value) || value.lt(first) || value.gt(last)) {
        throw new Error("Unsupported credential version");
    }
    return value.toNumber();
}
/** Decode only from a validated generic record; source U/system remains the caller's binding. */
function credentialPayload(record, expectedKey) {
    (0, address_1.decodeDestination)(expectedKey, vdxf_1.I_ADDR_VERSION);
    if (record.credentialKey !== expectedKey ||
        !record.flags.eq(record.calcFlags()) ||
        !record.isValid()) {
        throw new Error("Invalid authorization credential envelope");
    }
    (0, validation_1.rejectUnknownFields)(record.scopes, []);
    return record.credential;
}
/**
 * Typed records use their registered VDXF credential keys by default.
 * Explicit keys remain supported for callers using a separate namespace.
 */
class AuthorizationRecord {
    constructor(data, credentialKey) {
        this.data = data;
        this.credentialKey = credentialKey;
    }
    toCredential(credentialKey = this.credentialKey, label = "") {
        (0, address_1.decodeDestination)(credentialKey, vdxf_1.I_ADDR_VERSION);
        // Revalidate mutable data before emitting the compact, Core-compatible payload.
        const payload = this.toPayload();
        const record = new Credential_1.Credential({
            version: new bn_js_1.BN(Credential_1.Credential.VERSION_CURRENT),
            credentialKey,
            credential: payload,
            scopes: {},
            label,
        });
        // Credential already enforces Core's text bounds during construction.
        if (!record.isValid()) {
            throw new Error("Invalid authorization credential");
        }
        return record;
    }
}
AuthorizationRecord.VERSION_INVALID = new bn_js_1.BN(0);
AuthorizationRecord.VERSION_FIRST = new bn_js_1.BN(1);
AuthorizationRecord.VERSION_LAST = new bn_js_1.BN(1);
AuthorizationRecord.VERSION_CURRENT = new bn_js_1.BN(1);
/** The compact field names are a persisted protocol contract, not API field names. */
class AuthorizationCredential extends AuthorizationRecord {
    constructor(data) {
        super(data, AuthorizationCredential.CREDENTIAL_KEY);
        this.toPayload();
    }
    containsPermissions() {
        return !this.data.flags
            .and(AuthorizationCredential.FLAG_CONTAINS_PERMISSIONS)
            .isZero();
    }
    toPayload() {
        const d = this.data;
        (0, validation_1.rejectUnknownFields)(d, [
            "version",
            "flags",
            "grantID",
            "signingSystemID",
            "appID",
            "delegateID",
            "originalRevision",
            "storageManifestHash",
        ]);
        for (const address of [d.signingSystemID, d.appID, d.delegateID]) {
            (0, address_1.decodeDestination)(address, vdxf_1.I_ADDR_VERSION);
        }
        (0, validation_1.rejectUnknownFields)(d.originalRevision, ["lookupHeight", "txid", "vout"]);
        if (!bn_js_1.BN.isBN(d.flags) ||
            (!d.flags.eq(AuthorizationCredential.FLAGS_NONE) &&
                !d.flags.eq(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)) ||
            !d.flags
                .and(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)
                .isZero() !==
                (d.storageManifestHash !== undefined)) {
            throw new Error("Unsupported or inconsistent authorization flags");
        }
        return Object.assign({ v: version(d.version, AuthorizationCredential.VERSION_FIRST, AuthorizationCredential.VERSION_LAST), f: d.flags.toNumber(), g: (0, validation_1.normalizeFixedLengthHex)(d.grantID, 32), s: d.signingSystemID, a: d.appID, d: d.delegateID, o: [
                (0, validation_1.assertUint32)(d.originalRevision.lookupHeight),
                (0, validation_1.normalizeFixedLengthHex)(d.originalRevision.txid, 32),
                (0, validation_1.assertUint32)(d.originalRevision.vout),
            ] }, (d.storageManifestHash === undefined
            ? {}
            : { b: (0, validation_1.normalizeFixedLengthHex)(d.storageManifestHash, 32) }));
    }
    static fromCredential(record, expectedKey = AuthorizationCredential.CREDENTIAL_KEY) {
        return this.fromPayload(credentialPayload(record, expectedKey));
    }
    static fromPayload(payload) {
        (0, validation_1.rejectUnknownFields)(payload, ["v", "f", "g", "s", "a", "d", "o", "b"]);
        if (!Array.isArray(payload.o) || payload.o.length !== 3) {
            throw new Error("Invalid original revision");
        }
        return new AuthorizationCredential({
            version: new bn_js_1.BN((0, validation_1.assertUint32)(payload.v)),
            flags: new bn_js_1.BN((0, validation_1.assertUint32)(payload.f)),
            grantID: payload.g,
            signingSystemID: payload.s,
            appID: payload.a,
            delegateID: payload.d,
            originalRevision: {
                lookupHeight: payload.o[0],
                txid: payload.o[1],
                vout: payload.o[2],
            },
            storageManifestHash: payload.b,
        });
    }
}
exports.AuthorizationCredential = AuthorizationCredential;
AuthorizationCredential.CREDENTIAL_KEY = keys_1.IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION.vdxfid;
AuthorizationCredential.FLAGS_NONE = new bn_js_1.BN(0);
AuthorizationCredential.FLAG_CONTAINS_PERMISSIONS = new bn_js_1.BN(1);
AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS = new bn_js_1.BN(2);
/** Relationship headers and key records are stored separately to stay below 512 bytes. */
class AuthorizationStorageBindingCredential extends AuthorizationRecord {
    constructor(data) {
        super(data, AuthorizationStorageBindingCredential.CREDENTIAL_KEY);
        this.toPayload();
    }
    get recordID() {
        return `1:${this.data.relationshipIndex}`;
    }
    toPayload() {
        const d = this.data;
        (0, validation_1.rejectUnknownFields)(d, [
            "version",
            "grantID",
            "relationshipIndex",
            "storageSystemID",
            "storageID",
            "userKeyID",
            "revocationID",
            "recoveryID",
            "keyCount",
        ]);
        for (const address of [
            d.storageSystemID,
            d.storageID,
            d.revocationID,
            d.recoveryID,
        ]) {
            (0, address_1.decodeDestination)(address, vdxf_1.I_ADDR_VERSION);
        }
        if ((0, validation_1.assertUint32)(d.keyCount) === 0) {
            throw new Error("Storage requires app keys");
        }
        return {
            v: version(d.version, AuthorizationStorageBindingCredential.VERSION_FIRST, AuthorizationStorageBindingCredential.VERSION_LAST),
            g: (0, validation_1.normalizeFixedLengthHex)(d.grantID, 32),
            i: (0, validation_1.assertUint32)(d.relationshipIndex),
            s: d.storageSystemID,
            d: d.storageID,
            u: (0, validation_1.normalizeFixedLengthHex)(d.userKeyID, 20),
            r: d.revocationID,
            c: d.recoveryID,
            n: d.keyCount,
        };
    }
    static fromCredential(record, expectedKey = AuthorizationStorageBindingCredential.CREDENTIAL_KEY) {
        return this.fromPayload(credentialPayload(record, expectedKey));
    }
    static fromPayload(p) {
        (0, validation_1.rejectUnknownFields)(p, ["v", "g", "i", "s", "d", "u", "r", "c", "n"]);
        return new AuthorizationStorageBindingCredential({
            version: new bn_js_1.BN((0, validation_1.assertUint32)(p.v)),
            grantID: p.g,
            relationshipIndex: p.i,
            storageSystemID: p.s,
            storageID: p.d,
            userKeyID: p.u,
            revocationID: p.r,
            recoveryID: p.c,
            keyCount: p.n,
        });
    }
}
exports.AuthorizationStorageBindingCredential = AuthorizationStorageBindingCredential;
AuthorizationStorageBindingCredential.CREDENTIAL_KEY = keys_1.IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_BINDING.vdxfid;
/** Key indices identify semantic records independently of their encrypted stored copies. */
class AuthorizationStorageKeyCredential extends AuthorizationRecord {
    constructor(data) {
        super(data, AuthorizationStorageKeyCredential.CREDENTIAL_KEY);
        this.toPayload();
    }
    get recordID() {
        return `2:${this.data.relationshipIndex}:${this.data.keyIndex}`;
    }
    toPayload() {
        const d = this.data;
        (0, validation_1.rejectUnknownFields)(d, [
            "version",
            "grantID",
            "relationshipIndex",
            "keyIndex",
            "keyID",
        ]);
        return {
            v: version(d.version, AuthorizationStorageKeyCredential.VERSION_FIRST, AuthorizationStorageKeyCredential.VERSION_LAST),
            g: (0, validation_1.normalizeFixedLengthHex)(d.grantID, 32),
            i: (0, validation_1.assertUint32)(d.relationshipIndex),
            j: (0, validation_1.assertUint32)(d.keyIndex),
            k: (0, validation_1.normalizeFixedLengthHex)(d.keyID, 20),
        };
    }
    static fromCredential(record, expectedKey = AuthorizationStorageKeyCredential.CREDENTIAL_KEY) {
        return this.fromPayload(credentialPayload(record, expectedKey));
    }
    static fromPayload(p) {
        (0, validation_1.rejectUnknownFields)(p, ["v", "g", "i", "j", "k"]);
        return new AuthorizationStorageKeyCredential({
            version: new bn_js_1.BN((0, validation_1.assertUint32)(p.v)),
            grantID: p.g,
            relationshipIndex: p.i,
            keyIndex: p.j,
            keyID: p.k,
        });
    }
}
exports.AuthorizationStorageKeyCredential = AuthorizationStorageKeyCredential;
AuthorizationStorageKeyCredential.CREDENTIAL_KEY = keys_1.IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_KEY.vdxfid;
/** Validate the complete management set, collapse identical copies, and commit canonical bytes. */
function deriveAppAuthorizationStorageManifest(records) {
    var _a;
    const unique = new Map();
    let grant;
    // Multiple encrypted copies may describe the same record, but must agree exactly.
    for (const record of records) {
        if (!(record instanceof AuthorizationStorageBindingCredential) &&
            !(record instanceof AuthorizationStorageKeyCredential)) {
            throw new Error("Unknown storage record");
        }
        const payload = record.toPayload();
        const currentGrant = (0, validation_1.normalizeFixedLengthHex)(record.data.grantID, 32);
        if (grant !== undefined && grant !== currentGrant) {
            throw new Error("Mixed grant records");
        }
        grant = currentGrant;
        const previous = unique.get(record.recordID);
        if (previous &&
            JSON.stringify(previous.toPayload()) !== JSON.stringify(payload)) {
            throw new Error("Conflicting storage record");
        }
        unique.set(record.recordID, record);
    }
    // Sort indices numerically; lexical sorting would place relationship 10 before 2.
    const headers = [...unique.values()]
        .filter((r) => r instanceof AuthorizationStorageBindingCredential)
        .sort((a, b) => a.data.relationshipIndex - b.data.relationshipIndex);
    const keys = [...unique.values()]
        .filter((r) => r instanceof AuthorizationStorageKeyCredential)
        .sort((a, b) => a.data.relationshipIndex - b.data.relationshipIndex ||
        a.data.keyIndex - b.data.keyIndex);
    if (!headers.length) {
        throw new Error("Empty storage manifest");
    }
    const grouped = new Map();
    for (const key of keys) {
        const group = (_a = grouped.get(key.data.relationshipIndex)) !== null && _a !== void 0 ? _a : [];
        group.push(key);
        grouped.set(key.data.relationshipIndex, group);
    }
    // Iterate supplied records rather than trusting potentially huge declared counts.
    // Each relationship and its keys must form a complete, zero-based sequence.
    headers.forEach((header, i) => {
        var _a;
        if (header.data.relationshipIndex !== i) {
            throw new Error("Noncontiguous relationships");
        }
        const group = (_a = grouped.get(i)) !== null && _a !== void 0 ? _a : [];
        if (group.length !== header.data.keyCount) {
            throw new Error("Incomplete storage keys");
        }
        const seen = new Set();
        group.forEach((key, j) => {
            const normalized = (0, validation_1.normalizeFixedLengthHex)(key.data.keyID, 20);
            if (key.data.keyIndex !== j ||
                seen.has(normalized) ||
                normalized === (0, validation_1.normalizeFixedLengthHex)(header.data.userKeyID, 20)) {
                throw new Error("Invalid storage key assignment");
            }
            seen.add(normalized);
        });
        grouped.delete(i);
    });
    if (grouped.size) {
        throw new Error("Orphan storage keys");
    }
    // Manifest discriminators 1 and 2 are local record types, not VDXF ordinals.
    // Commit decoded address IDs and little-endian indices, excluding JSON/encryption.
    const encoded = [
        ...headers.map(({ data: d }) => Buffer.concat([
            Buffer.from([1]),
            (0, serialization_1.encodeUInt32LE)(d.relationshipIndex),
            (0, validation_1.decodeFixedLengthHex)(d.grantID, 32),
            (0, address_1.decodeDestination)(d.storageSystemID, vdxf_1.I_ADDR_VERSION),
            (0, address_1.decodeDestination)(d.storageID, vdxf_1.I_ADDR_VERSION),
            (0, validation_1.decodeFixedLengthHex)(d.userKeyID, 20),
            (0, address_1.decodeDestination)(d.revocationID, vdxf_1.I_ADDR_VERSION),
            (0, address_1.decodeDestination)(d.recoveryID, vdxf_1.I_ADDR_VERSION),
            (0, serialization_1.encodeUInt32LE)(d.keyCount),
        ])),
        ...keys.map(({ data: d }) => Buffer.concat([
            Buffer.from([2]),
            (0, serialization_1.encodeUInt32LE)(d.relationshipIndex),
            (0, serialization_1.encodeUInt32LE)(d.keyIndex),
            (0, validation_1.decodeFixedLengthHex)(d.grantID, 32),
            (0, validation_1.decodeFixedLengthHex)(d.keyID, 20),
        ])),
    ];
    // Length-prefix each record to preserve unambiguous framing across implementations.
    return (0, hash_1.hashData)(Buffer.concat([
        Buffer.from("VerusAppAuthorizationStorage/v1\0"),
        varuint_1.default.encode(encoded.length, undefined, 0).buffer,
        ...encoded.flatMap((bytes) => [
            varuint_1.default.encode(bytes.length, undefined, 0).buffer,
            bytes,
        ]),
    ])).toString("hex");
}
/** Verify the committed set against this grant, including its grant ID. */
function verifyAppAuthorizationStorageManifest(grant, records) {
    try {
        grant.toPayload();
        if (grant.data.flags
            .and(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)
            .isZero()) {
            return records.length === 0;
        }
        if (records.some((record) => (0, validation_1.normalizeFixedLengthHex)(record.data.grantID, 32) !==
            (0, validation_1.normalizeFixedLengthHex)(grant.data.grantID, 32))) {
            return false;
        }
        return (deriveAppAuthorizationStorageManifest(records) ===
            (0, validation_1.normalizeFixedLengthHex)(grant.data.storageManifestHash, 32));
    }
    catch (_a) {
        return false;
    }
}
