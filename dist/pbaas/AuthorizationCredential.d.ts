import { BigNumber } from "../utils/types/BigNumber";
import { Credential } from "./Credential";
/** Persistent delegation metadata; the containing user identity supplies the user binding. */
export interface AuthorizationCredentialData {
    version: BigNumber;
    flags: BigNumber;
    grantID: string;
    signingSystemID: string;
    appID: string;
    delegateID: string;
    originalRevision: {
        lookupHeight: number;
        txid: string;
        vout: number;
    };
    storageManifestHash?: string;
}
/** One storage relationship and the independent user authorities required to manage it. */
export interface AuthorizationStorageBindingData {
    version: BigNumber;
    grantID: string;
    relationshipIndex: number;
    storageSystemID: string;
    storageID: string;
    userKeyID: string;
    revocationID: string;
    recoveryID: string;
    keyCount: number;
}
/** One app signing authority installed in a storage relationship. */
export interface AuthorizationStorageKeyData {
    version: BigNumber;
    grantID: string;
    relationshipIndex: number;
    keyIndex: number;
    keyID: string;
}
/**
 * Typed records use their registered VDXF credential keys by default.
 * Explicit keys remain supported for callers using a separate namespace.
 */
declare abstract class AuthorizationRecord<T> {
    data: T;
    private readonly credentialKey;
    static VERSION_INVALID: import("bn.js");
    static VERSION_FIRST: import("bn.js");
    static VERSION_LAST: import("bn.js");
    static VERSION_CURRENT: import("bn.js");
    constructor(data: T, credentialKey: string);
    abstract toPayload(): object;
    toCredential(credentialKey?: string, label?: string): Credential;
}
/** The compact field names are a persisted protocol contract, not API field names. */
export declare class AuthorizationCredential extends AuthorizationRecord<AuthorizationCredentialData> {
    static CREDENTIAL_KEY: string;
    static FLAGS_NONE: import("bn.js");
    static FLAG_CONTAINS_PERMISSIONS: import("bn.js");
    static FLAG_CONTAINS_STORAGE_BINDINGS: import("bn.js");
    constructor(data: AuthorizationCredentialData);
    containsPermissions(): boolean;
    toPayload(): object;
    static fromCredential(record: Credential, expectedKey?: string): AuthorizationCredential;
    static fromPayload(payload: any): AuthorizationCredential;
}
/** Relationship headers and key records are stored separately to stay below 512 bytes. */
export declare class AuthorizationStorageBindingCredential extends AuthorizationRecord<AuthorizationStorageBindingData> {
    static CREDENTIAL_KEY: string;
    constructor(data: AuthorizationStorageBindingData);
    get recordID(): string;
    toPayload(): object;
    static fromCredential(record: Credential, expectedKey?: string): AuthorizationStorageBindingCredential;
    static fromPayload(p: any): AuthorizationStorageBindingCredential;
}
/** Key indices identify semantic records independently of their encrypted stored copies. */
export declare class AuthorizationStorageKeyCredential extends AuthorizationRecord<AuthorizationStorageKeyData> {
    static CREDENTIAL_KEY: string;
    constructor(data: AuthorizationStorageKeyData);
    get recordID(): string;
    toPayload(): object;
    static fromCredential(record: Credential, expectedKey?: string): AuthorizationStorageKeyCredential;
    static fromPayload(p: any): AuthorizationStorageKeyCredential;
}
export type AuthorizationStorageRecord = AuthorizationStorageBindingCredential | AuthorizationStorageKeyCredential;
/** Validate the complete management set, collapse identical copies, and commit canonical bytes. */
export declare function deriveAppAuthorizationStorageManifest(records: AuthorizationStorageRecord[]): string;
/** Verify the committed set against this grant, including its grant ID. */
export declare function verifyAppAuthorizationStorageManifest(grant: AuthorizationCredential, records: AuthorizationStorageRecord[]): boolean;
export {};
