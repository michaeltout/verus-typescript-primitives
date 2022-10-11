export interface VDXFKeyInterface {
    vdxfid: string;
    hash160result: string;
    qualifiedname: {
        name: string;
        namespace: string;
    };
}
export declare const LOGIN_CONSENT_REQUEST_SIG_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_REQUEST_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_RESPONSE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_CHALLENGE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_DECISION_VDXF_KEY: VDXFKeyInterface;
export declare const WALLET_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_REDIRECT_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_WEBHOOK_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_CONTEXT_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_CONTEXT_ID_PROVISIONING_SUBJECT_WEBHOOK_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_REQUEST_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_CHALLENGE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_DECISION_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESPONSE_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESULT_VDXF_KEY: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGREQUIREDINFO: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_PENDINGAPPROVAL: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_COMPLETE: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_RESULT_STATE_FAILED: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_NAMETAKEN: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_UNKNOWN: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_COMMIT_FAILED: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_CREATION_FAILED: VDXFKeyInterface;
export declare const LOGIN_CONSENT_PROVISIONING_ERROR_KEY_TRANSFER_FAILED: VDXFKeyInterface;
