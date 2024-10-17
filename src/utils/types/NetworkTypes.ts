/**
 * @prettier
 */

export type NetworkName =
  | 'verus'
  | 'verustest';

export type Network = {
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

export type ZcashNetwork = Network & {
  consensusBranchId: Record<number, number>;
  isZcashCompatible: boolean;
};

export type PBaaSNetwork = ZcashNetwork & {
  verusID: number;
  isPBaaS: boolean;
};