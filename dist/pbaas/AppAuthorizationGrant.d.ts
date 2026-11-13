export interface AppAuthorizationIdentity {
    systemID: string;
    identityID: string;
}
/**
 * Bind an envelope hash to the selected user, request signer and app scope.
 * Signature metadata is not part of the raw envelope hash, so callers must
 * supply identities obtained from the verified request and selected user.
 */
export declare function deriveAppAuthorizationGrantID(user: AppAuthorizationIdentity, delegate: AppAuthorizationIdentity, appID: string, originalRequestHash: string): string;
