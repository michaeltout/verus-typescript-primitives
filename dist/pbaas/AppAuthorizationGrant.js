"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveAppAuthorizationGrantID = deriveAppAuthorizationGrantID;
const hash_1 = require("../utils/hash");
const string_1 = require("../utils/string");
const vdxf_1 = require("../constants/vdxf");
const address_1 = require("../utils/address");
const vdxf_2 = require("../constants/vdxf");
/**
 * Bind an envelope hash to the selected user, request signer and app scope.
 * Signature metadata is not part of the raw envelope hash, so callers must
 * supply identities obtained from the verified request and selected user.
 */
function deriveAppAuthorizationGrantID(user, delegate, appID, originalRequestHash) {
    if (!(0, string_1.isHexString)(originalRequestHash) ||
        originalRequestHash.length !== vdxf_1.HASH256_BYTE_LENGTH * 2) {
        throw new Error("Expected a 32-byte request hash");
    }
    // Domain separation and field order are fixed by the v1 protocol. Address IDs
    // and the request hash are concatenated without RPC transaction-hash reversal.
    return (0, hash_1.hashData)(Buffer.concat([
        Buffer.from("VerusAppAuthorizationGrant/v1\0", "utf8"),
        (0, address_1.decodeDestination)(user.systemID, vdxf_2.I_ADDR_VERSION),
        (0, address_1.decodeDestination)(user.identityID, vdxf_2.I_ADDR_VERSION),
        (0, address_1.decodeDestination)(delegate.systemID, vdxf_2.I_ADDR_VERSION),
        (0, address_1.decodeDestination)(delegate.identityID, vdxf_2.I_ADDR_VERSION),
        (0, address_1.decodeDestination)(appID, vdxf_2.I_ADDR_VERSION),
        Buffer.from(originalRequestHash, "hex"),
    ])).toString("hex");
}
