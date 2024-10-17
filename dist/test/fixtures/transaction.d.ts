export declare const TRANSACTION_FIXTURES: {
    valid: ({
        description: string;
        id: string;
        hash: string;
        hex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                script: string;
                sequence: number;
            }[];
            outs: {
                script: string;
                value: number;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
        whex?: undefined;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        raw: {
            version: number;
            locktime: number;
            ins: ({
                hash: string;
                index: number;
                script: string;
                sequence: any;
            } | {
                hash: string;
                index: number;
                script: string;
                sequence?: undefined;
            })[];
            outs: {
                value: number;
                script: string;
            }[];
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
        whex?: undefined;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                data: string;
            }[];
            outs: {
                script: string;
                value: number;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
        whex?: undefined;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        raw: {
            version: number;
            locktime: number;
            ins: {
                hash: string;
                index: number;
                script: string;
            }[];
            outs: {
                data: string;
                value: number;
            }[];
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
        whex?: undefined;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        whex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                script: string;
                value: number;
            }[];
            outs: {
                value: number;
                script: string;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        whex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                script: string;
                value: number;
            }[];
            outs: {
                value: number;
                script: string;
                scriptHex: string;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        whex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                script: string;
            }[];
            outs: {
                value: number;
                script: string;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
    } | {
        description: string;
        id: string;
        hash: string;
        hex: string;
        whex: string;
        raw: {
            version: number;
            ins: {
                hash: string;
                index: number;
                script: string;
            }[];
            outs: {
                value: number;
                script: string;
                scriptHex: string;
            }[];
            locktime: number;
        };
        coinbase: boolean;
        virtualSize: number;
        weight: number;
    })[];
    hashForSignature: ({
        description: string;
        txHex: string;
        inIndex: number;
        script: string;
        type: number;
        hash: string;
    } | {
        txHex: string;
        inIndex: number;
        script: string;
        type: number;
        hash: string;
        description?: undefined;
    })[];
    invalid: {
        addInput: {
            exception: string;
            hash: string;
            index: number;
        }[];
        fromBuffer: {
            exception: string;
            hex: string;
        }[];
    };
};
