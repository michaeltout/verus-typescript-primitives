/**
 * @prettier
 */
export declare type NetworkName = 'verus' | 'verustest';
export declare type Network = {
    messagePrefix: string;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
    bip32: {
        public: number;
        private: number;
    };
    bech32?: string;
    forkId?: number;
    coin: 'vrsc';
};
export declare type ZcashNetwork = Network & {
    consensusBranchId: Record<number, number>;
    isZcashCompatible: boolean;
};
export declare type PBaaSNetwork = ZcashNetwork & {
    verusID: number;
    isPBaaS: boolean;
};
