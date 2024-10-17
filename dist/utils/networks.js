"use strict";
function getDefaultBip32Mainnet() {
    return {
        // base58 'xpub'
        public: 0x0488b21e,
        // base58 'xprv'
        private: 0x0488ade4,
    };
}
const networks = {
    verus: {
        messagePrefix: '\x15Verus signed data:\n',
        bech32: 'bc',
        bip32: getDefaultBip32Mainnet(),
        pubKeyHash: 0x3c,
        scriptHash: 0x55,
        verusID: 0x66,
        wif: 0xBC,
        consensusBranchId: {
            1: 0x00,
            2: 0x00,
            3: 0x5ba81b19,
            4: 0x76b809bb
        },
        coin: 'vrsc',
        isPBaaS: true,
        isZcashCompatible: true
    },
    verustest: {
        messagePrefix: '\x15Verus signed data:\n',
        bech32: 'bc',
        bip32: getDefaultBip32Mainnet(),
        pubKeyHash: 0x3c,
        scriptHash: 0x55,
        verusID: 0x66,
        wif: 0xBC,
        consensusBranchId: {
            1: 0x00,
            2: 0x00,
            3: 0x5ba81b19,
            4: 0x76b809bb
        },
        coin: 'vrsc',
        isPBaaS: true,
        isZcashCompatible: true
    }
};
module.exports = networks;
