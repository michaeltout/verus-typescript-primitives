/// <reference types="node" />
interface TxInput {
    hash: Buffer;
    index: number;
    script: Buffer;
    sequence: number;
    witness: Buffer[];
}
interface TxOutput {
    script: Buffer;
    value: number | Buffer;
}
declare class Transaction {
    static DEFAULT_SEQUENCE: number;
    static SIGHASH_ALL: number;
    static SIGHASH_NONE: number;
    static SIGHASH_SINGLE: number;
    static SIGHASH_ANYONECANPAY: number;
    static SIGHASH_FORKID: number;
    static ADVANCED_TRANSACTION_MARKER: number;
    static ADVANCED_TRANSACTION_FLAG: number;
    static EMPTY_SCRIPT: Buffer;
    static EMPTY_WITNESS: Buffer[];
    static ZERO: Buffer;
    static ONE: Buffer;
    static VALUE_UINT64_MAX: Buffer;
    static VALUE_INT64_ZERO: Buffer;
    static BLANK_OUTPUT: {
        script: Buffer;
        value: Buffer;
    };
    version: number;
    locktime: number;
    ins: TxInput[];
    outs: TxOutput[];
    network: any;
    overwintered: number;
    versionGroupId: number;
    expiryHeight: number;
    consensusBranchId: number;
    constructor(network?: import("../utils/types/NetworkTypes").PBaaSNetwork);
    static fromBuffer(buffer: Buffer, network?: import("../utils/types/NetworkTypes").PBaaSNetwork, __noStrict?: boolean): Transaction;
    static fromHex(hex: string, network?: any): Transaction;
    static isCoinbaseHash(buffer: Buffer): boolean;
    isSaplingCompatible(): boolean;
    isOverwinterCompatible(): boolean;
    supportsJoinSplits(): boolean;
    isCoinbase(): boolean;
    addInput(hash: Buffer, index: number, sequence?: number, scriptSig?: Buffer): number;
    addOutput(scriptPubKey: Buffer, value: number): number;
    hasWitnesses(): boolean;
    weight(): number;
    virtualSize(): number;
    byteLength(): number;
    clone(): Transaction;
    getHeader(): number;
    hashForSignature(inIndex: number, prevOutScript: Buffer, hashType: number): Buffer;
    hashForZcashSignature(inIndex: number, prevOutScript: Buffer, value: number, hashType: number): Buffer;
    getHash(): Buffer;
    getId(): string;
    toBuffer(buffer?: Buffer, initialOffset?: number): Buffer;
    toHex(): string;
    setInputScript(index: number, scriptSig: Buffer): void;
    setWitness(index: number, witness: Buffer[]): void;
    private __byteLength;
    private __toBuffer;
    private getPrevoutHash;
    private getSequenceHash;
    private getOutputsHash;
    private getBlake2bHash;
    private varSliceSize;
}
export default Transaction;
