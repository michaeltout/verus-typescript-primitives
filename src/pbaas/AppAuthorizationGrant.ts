import { hashData } from "../utils/hash";
import { isHexString } from "../utils/string";
import { HASH256_BYTE_LENGTH } from "../constants/vdxf";
import { decodeDestination } from "../utils/address";
import { I_ADDR_VERSION } from "../constants/vdxf";

export interface AppAuthorizationIdentity {
  systemID: string;
  identityID: string;
}

/**
 * Bind an envelope hash to the selected user, request signer and app scope.
 * Signature metadata is not part of the raw envelope hash, so callers must
 * supply identities obtained from the verified request and selected user.
 */
export function deriveAppAuthorizationGrantID(
  user: AppAuthorizationIdentity,
  delegate: AppAuthorizationIdentity,
  appID: string,
  originalRequestHash: string
): string {
  if (
    !isHexString(originalRequestHash) ||
    originalRequestHash.length !== HASH256_BYTE_LENGTH * 2
  ) {
    throw new Error("Expected a 32-byte request hash");
  }

  // Domain separation and field order are fixed by the v1 protocol. Address IDs
  // and the request hash are concatenated without RPC transaction-hash reversal.
  return hashData(
    Buffer.concat([
      Buffer.from("VerusAppAuthorizationGrant/v1\0", "utf8"),
      decodeDestination(user.systemID, I_ADDR_VERSION),
      decodeDestination(user.identityID, I_ADDR_VERSION),
      decodeDestination(delegate.systemID, I_ADDR_VERSION),
      decodeDestination(delegate.identityID, I_ADDR_VERSION),
      decodeDestination(appID, I_ADDR_VERSION),
      Buffer.from(originalRequestHash, "hex"),
    ])
  ).toString("hex");
}
