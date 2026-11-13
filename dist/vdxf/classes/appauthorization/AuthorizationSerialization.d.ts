import { BoundedBufferReader } from "../../../utils/serialization";
export declare const COMPACT_IDENTITY_ADDRESS_BYTE_LENGTH: number;
export declare const ROLE_TAGGED_IDENTITY_ADDRESS_BYTE_LENGTH: number;
export declare const STORAGE_BINDING_BYTE_LENGTH: number;
/** Bounded reader shared by the authorization codecs. */
export declare class AuthorizationReader extends BoundedBufferReader {
    address(): string;
}
/** Immutable approval baseline; the outpoint disambiguates revisions in one block. */
export interface IdentityRevisionReference {
    systemID: string;
    identityID: string;
    lookupHeight: number;
    txid: string;
    vout: number;
}
