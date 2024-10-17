import * as blake2b from 'blake2b';
import { hash256 } from '../../utils/hash';
import { compile, decompile } from '../../utils/script';
import { OPS } from '../../utils/ops';
import varuint from "../../utils/varuint";
import networks = require('../../utils/networks');
import bufferutils from '../../utils/bufferutils';
import { BN } from 'bn.js';
import { SerializableEntity } from '../../utils/types/SerializableEntity';

const { BufferReader, BufferWriter } = bufferutils;

const ZCASH_VERSION = {
  JOINSPLITS_SUPPORT: 2,
  OVERWINTER: 3,
  SAPLING: 4
};

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

export class Transaction {
  static DEFAULT_SEQUENCE = 0xffffffff;
  static SIGHASH_ALL = 0x01;
  static SIGHASH_NONE = 0x02;
  static SIGHASH_SINGLE = 0x03;
  static SIGHASH_ANYONECANPAY = 0x80;
  static SIGHASH_FORKID = 0x40;
  static ADVANCED_TRANSACTION_MARKER = 0x00;
  static ADVANCED_TRANSACTION_FLAG = 0x01;

  static EMPTY_SCRIPT = Buffer.allocUnsafe(0);
  static EMPTY_WITNESS: Buffer[] = [];
  static ZERO = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
  static ONE = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
  static VALUE_UINT64_MAX = Buffer.from('ffffffffffffffff', 'hex');
  static VALUE_INT64_ZERO = Buffer.from('0000000000000000', 'hex');
  static BLANK_OUTPUT = {
    script: Transaction.EMPTY_SCRIPT,
    value: Transaction.VALUE_UINT64_MAX
  }

  version: number;
  locktime: number;
  ins: TxInput[];
  outs: TxOutput[];
  network: any;
  overwintered: number;
  versionGroupId: number;
  expiryHeight: number;
  consensusBranchId: number;

  constructor(network = networks.verus) {
    this.version = 1;
    this.locktime = 0;
    this.ins = [];
    this.outs = [];
    this.network = network;
    this.overwintered = 0;
    this.versionGroupId = 0;
    this.expiryHeight = 0;
    this.consensusBranchId = network.consensusBranchId[this.version];
  }

  static fromBuffer(buffer: Buffer, network = networks.verus, __noStrict?: boolean): Transaction {
    const bufferReader = new BufferReader(buffer);
    const tx = new Transaction(network);

    tx.version = bufferReader.readInt32();
    tx.overwintered = tx.version >>> 31;
    
    tx.version = tx.version & 0x07FFFFFFF;

    if (tx.overwintered && !network.consensusBranchId.hasOwnProperty(tx.version)) {
      throw new Error('Unsupported Zcash transaction version ' + tx.version);
    }
    tx.consensusBranchId = network.consensusBranchId[tx.version];

    if (tx.isOverwinterCompatible()) {
      tx.versionGroupId = bufferReader.readUInt32();
    }

    const vinLen = bufferReader.readVarInt();
    for (let i = 0; i < vinLen.toNumber(); ++i) {
      tx.ins.push({
        hash: bufferReader.readSlice(32),
        index: bufferReader.readUInt32(),
        script: bufferReader.readVarSlice(),
        sequence: bufferReader.readUInt32(),
        witness: Transaction.EMPTY_WITNESS
      });
    }

    const voutLen = bufferReader.readVarInt();
    for (let i = 0; i < voutLen.toNumber(); ++i) {
      tx.outs.push({
        value: bufferReader.readUInt64(),
        script: bufferReader.readVarSlice()
      });
    }

    tx.locktime = bufferReader.readUInt32();

    if (tx.isOverwinterCompatible()) {
      tx.expiryHeight = bufferReader.readUInt32();
    }

    if (tx.isSaplingCompatible()) {
      const valueBalance = bufferReader.readSlice(8);
      if (!valueBalance.equals(Transaction.VALUE_INT64_ZERO)) {
        throw new Error('unsupported valueBalance');
      }

      const nShieldedSpend = bufferReader.readVarInt();
      if (!nShieldedSpend.eq(new BN(0))) {
        throw new Error('shielded spend not supported');
      }

      const nShieldedOutput = bufferReader.readVarInt();
      if (!nShieldedOutput.eq(new BN(0))) {
        throw new Error('shielded output not supported');
      }
    }

    if (tx.supportsJoinSplits()) {
      const joinSplitsLen = bufferReader.readVarInt();
      if (!joinSplitsLen.eq(new BN(0))) {
        throw new Error('joinSplits not supported');
      }
    }

    if (!__noStrict && bufferReader.offset !== buffer.length) {
      throw new Error('Transaction has unexpected data');
    }

    return tx;
  }

  static fromHex(hex: string, network?: any): Transaction {
    return Transaction.fromBuffer(Buffer.from(hex, 'hex'), network);
  }

  static isCoinbaseHash(buffer: Buffer): boolean {
    for (let i = 0; i < 32; ++i) {
      if (buffer[i] !== 0) return false;
    }
    return true;
  }

  isSaplingCompatible(): boolean {
    return this.version >= ZCASH_VERSION.SAPLING;
  }

  isOverwinterCompatible(): boolean {
    return this.version >= ZCASH_VERSION.OVERWINTER;
  }

  supportsJoinSplits(): boolean {
    return this.version >= ZCASH_VERSION.JOINSPLITS_SUPPORT;
  }

  isCoinbase(): boolean {
    return this.ins.length === 1 && Transaction.isCoinbaseHash(this.ins[0].hash);
  }

  addInput(hash: Buffer, index: number, sequence?: number, scriptSig?: Buffer): number {
    if (hash.length !== 32) {
      throw new Error(`Expected input hash to have length 32, got length ${hash.length}`)
    }
    
    if (sequence == undefined) {
      sequence = Transaction.DEFAULT_SEQUENCE;
    }

    return (this.ins.push({
      hash,
      index,
      script: scriptSig || Transaction.EMPTY_SCRIPT,
      sequence,
      witness: Transaction.EMPTY_WITNESS
    }) - 1);
  }

  addOutput(scriptPubKey: Buffer, value: number): number {
    return (this.outs.push({
      script: scriptPubKey,
      value
    }) - 1);
  }

  weight(): number {
    const base = this.__byteLength();
    const total = this.__byteLength();
    return base * 3 + total;
  }

  virtualSize(): number {
    return Math.ceil(this.weight() / 4);
  }

  byteLength(): number {
    return this.__byteLength();
  }

  clone(): Transaction {
    const newTx = new Transaction(this.network);
    newTx.version = this.version;
    newTx.locktime = this.locktime;
    newTx.network = this.network;
    newTx.consensusBranchId = this.consensusBranchId;

    if (this.isOverwinterCompatible()) {
      newTx.overwintered = this.overwintered;
      newTx.versionGroupId = this.versionGroupId;
      newTx.expiryHeight = this.expiryHeight;
    }

    newTx.ins = this.ins.map(txIn => ({
      hash: txIn.hash,
      index: txIn.index,
      script: txIn.script,
      sequence: txIn.sequence,
      witness: txIn.witness
    }));

    newTx.outs = this.outs.map(txOut => ({
      script: txOut.script,
      value: txOut.value
    }));

    return newTx;
  }

  getHeader(): number {
    const mask = (this.overwintered ? 1 : 0);
    return this.version | (mask << 31);
  }

  hashForSignature(inIndex: number, prevOutScript: Buffer, hashType: number): Buffer {
    if (inIndex >= this.ins.length) return Transaction.ONE;

    const txTmp = this.clone();
    const ourScript = compile(decompile(prevOutScript)!.filter(x => x !== OPS.OP_CODESEPARATOR));

    if ((hashType & 0x1f) === Transaction.SIGHASH_NONE) {
      txTmp.outs = [];
      txTmp.ins.forEach((input, i) => {
        if (i === inIndex) return;
        input.sequence = 0;
      });
    } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE) {
      if (inIndex >= this.outs.length) return Transaction.ONE;

      txTmp.outs.length = inIndex + 1;

      for (let i = 0; i < inIndex; i++) {
        txTmp.outs[i] = { ...Transaction.BLANK_OUTPUT };
      }

      txTmp.ins.forEach((input, y) => {
        if (y === inIndex) return;
        input.sequence = 0;
      });
    }

    if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
      txTmp.ins = [txTmp.ins[inIndex]];
      txTmp.ins[0].script = ourScript;
    } else {
      txTmp.ins.forEach(input => { input.script = Transaction.EMPTY_SCRIPT; });
      txTmp.ins[inIndex].script = ourScript;
    }

    const buffer = Buffer.allocUnsafe(txTmp.__byteLength() + 4);
    buffer.writeInt32LE(hashType, buffer.length - 4);
    txTmp.__toBuffer(buffer, 0);

    return hash256(buffer);
  }

  hashForZcashSignature(inIndex: number, prevOutScript: Buffer, value: number, hashType: number): Buffer {
    if (inIndex >= this.ins.length && inIndex !== 0xffffffff) {
      throw new Error('Input index is out of range');
    }

    if (this.isOverwinterCompatible()) {
      const hashPrevouts = this.getPrevoutHash(hashType);
      const hashSequence = this.getSequenceHash(hashType);
      const hashOutputs = this.getOutputsHash(hashType, inIndex);
      const hashJoinSplits = Transaction.ZERO;
      const hashShieldedSpends = Transaction.ZERO;
      const hashShieldedOutputs = Transaction.ZERO;

      let baseBufferSize = 0;
      baseBufferSize += 4 * 5;  // header, nVersionGroupId, lock_time, nExpiryHeight, hashType
      baseBufferSize += 32 * 4;  // 256 hashes: hashPrevouts, hashSequence, hashOutputs, hashJoinSplits
      if (inIndex !== 0xffffffff) {
        baseBufferSize += 4 * 2;  // input.index, input.sequence
        baseBufferSize += 8;  // value
        baseBufferSize += 32;  // input.hash
        baseBufferSize += this.varSliceSize(prevOutScript);  // prevOutScript
      }
      if (this.isSaplingCompatible()) {
        baseBufferSize += 32 * 2;  // hashShieldedSpends and hashShieldedOutputs
        baseBufferSize += 8;  // valueBalance
      }
      const bufferWriter = new BufferWriter(Buffer.alloc(baseBufferSize));

      bufferWriter.writeInt32(this.getHeader());
      bufferWriter.writeUInt32(this.versionGroupId);
      bufferWriter.writeSlice(hashPrevouts);
      bufferWriter.writeSlice(hashSequence);
      bufferWriter.writeSlice(hashOutputs);
      bufferWriter.writeSlice(hashJoinSplits);
      if (this.isSaplingCompatible()) {
        bufferWriter.writeSlice(hashShieldedSpends);
        bufferWriter.writeSlice(hashShieldedOutputs);
      }
      bufferWriter.writeUInt32(this.locktime);
      bufferWriter.writeUInt32(this.expiryHeight);
      if (this.isSaplingCompatible()) {
        bufferWriter.writeSlice(Transaction.VALUE_INT64_ZERO);
      }
      bufferWriter.writeUInt32(hashType);

      if (inIndex !== 0xffffffff) {
        const input = this.ins[inIndex];
        bufferWriter.writeSlice(input.hash);
        bufferWriter.writeUInt32(input.index);
        bufferWriter.writeVarSlice(prevOutScript);
        bufferWriter.writeUInt64(value);
        bufferWriter.writeUInt32(input.sequence);
      }

      const personalization = Buffer.alloc(16);
      const prefix = 'ZcashSigHash';
      personalization.write(prefix);
      personalization.writeUInt32LE(this.consensusBranchId, prefix.length);

      return this.getBlake2bHash(bufferWriter.buffer, personalization);
    }

    throw new Error('Unsupported version');
  }

  getHash(): Buffer {
    return hash256(this.__toBuffer(undefined, undefined));
  }

  getId(): string {
    return this.getHash().reverse().toString('hex');
  }

  toBuffer(buffer?: Buffer, initialOffset?: number): Buffer {
    return this.__toBuffer(buffer, initialOffset);
  }

  toHex(): string {
    return this.toBuffer().toString('hex');
  }

  setInputScript(index: number, scriptSig: Buffer): void {
    this.ins[index].script = scriptSig;
  }

  private __byteLength(): number {
    let byteLength = 0;
    byteLength += 4; // Header
    if (this.isOverwinterCompatible()) {
      byteLength += 4; // nVersionGroupId
    }
    byteLength += varuint.encodingLength(this.ins.length); // tx_in_count
    byteLength += this.ins.reduce((sum, input) => sum + 40 + this.varSliceSize(input.script), 0); // tx_in
    byteLength += varuint.encodingLength(this.outs.length); // tx_out_count
    byteLength += this.outs.reduce((sum, output) => sum + 8 + this.varSliceSize(output.script), 0); // tx_out
    byteLength += 4; // lock_time
    if (this.isOverwinterCompatible()) {
      byteLength += 4; // nExpiryHeight
    }
    if (this.isSaplingCompatible()) {
      byteLength += 8; // valueBalance
      byteLength += varuint.encodingLength(0); // nShieldedSpend
      byteLength += varuint.encodingLength(0); // nShieldedOutput
    }
    if (this.supportsJoinSplits()) {
      byteLength += varuint.encodingLength(0); // joinSplits
    }
    return byteLength;
  }

  private __toBuffer(buffer?: Buffer, initialOffset?: number): Buffer {
    if (!buffer) buffer = Buffer.allocUnsafe(this.__byteLength());

    const bufferWriter = new BufferWriter(buffer, initialOffset || 0);

    if (this.isOverwinterCompatible()) {
      const mask = (this.overwintered ? 1 : 0);
      bufferWriter.writeInt32(this.version | (mask << 31)); // Set overwinter bit
      bufferWriter.writeUInt32(this.versionGroupId);
    } else {
      bufferWriter.writeInt32(this.version);
    }

    bufferWriter.writeVarInt(new BN(this.ins.length));

    this.ins.forEach((txIn) => {
      bufferWriter.writeSlice(txIn.hash);
      bufferWriter.writeUInt32(txIn.index);
      bufferWriter.writeVarSlice(txIn.script);
      bufferWriter.writeUInt32(txIn.sequence);
    });

    bufferWriter.writeVarInt(new BN(this.outs.length));
    this.outs.forEach((txOut) => {
      if (typeof txOut.value === 'number') {
        bufferWriter.writeUInt64(txOut.value);
      } else {
        bufferWriter.writeSlice(txOut.value);
      }
      bufferWriter.writeVarSlice(txOut.script);
    });

    bufferWriter.writeUInt32(this.locktime);

    if (this.isOverwinterCompatible()) {
      bufferWriter.writeUInt32(this.expiryHeight);
    }

    if (this.isSaplingCompatible()) {
      bufferWriter.writeSlice(Transaction.VALUE_INT64_ZERO);
      bufferWriter.writeVarInt(new BN(0)); // nShieldedSpend
      bufferWriter.writeVarInt(new BN(0)); // nShieldedOutput
    }

    if (this.supportsJoinSplits()) {
      bufferWriter.writeVarInt(new BN(0)); // joinSplits
    }

    if (initialOffset !== undefined) return buffer.slice(initialOffset, bufferWriter.offset);
    return buffer.slice(0, bufferWriter.offset);
  }

  private getPrevoutHash(hashType: number): Buffer {
    if (!(hashType & Transaction.SIGHASH_ANYONECANPAY)) {
      const bufferWriter = new BufferWriter(Buffer.allocUnsafe(36 * this.ins.length));

      this.ins.forEach((txIn) => {
        bufferWriter.writeSlice(txIn.hash);
        bufferWriter.writeUInt32(txIn.index);
      });

      return this.getBlake2bHash(bufferWriter.buffer, 'ZcashPrevoutHash');
    }
    return Transaction.ZERO;
  }

  private getSequenceHash(hashType: number): Buffer {
    if (!(hashType & Transaction.SIGHASH_ANYONECANPAY) &&
      (hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
      (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
      const bufferWriter = new BufferWriter(Buffer.allocUnsafe(4 * this.ins.length));

      this.ins.forEach((txIn) => {
        bufferWriter.writeUInt32(txIn.sequence);
      });

      return this.getBlake2bHash(bufferWriter.buffer, 'ZcashSequencHash');
    }
    return Transaction.ZERO;
  }

  private getOutputsHash(hashType: number, inIndex: number): Buffer {
    if ((hashType & 0x1f) !== Transaction.SIGHASH_SINGLE && (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
      const txOutsSize = this.outs.reduce((sum, output) => sum + 8 + this.varSliceSize(output.script), 0);
      const bufferWriter = new BufferWriter(Buffer.allocUnsafe(txOutsSize));

      this.outs.forEach((out) => {
        if (typeof out.value === 'number') {
          bufferWriter.writeUInt64(out.value);
        } else {
          bufferWriter.writeSlice(out.value);
        }
        bufferWriter.writeVarSlice(out.script);
      });

      return this.getBlake2bHash(bufferWriter.buffer, 'ZcashOutputsHash');
    } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE && inIndex < this.outs.length) {
      const output = this.outs[inIndex];
      const bufferWriter = new BufferWriter(Buffer.allocUnsafe(8 + this.varSliceSize(output.script)));
      if (typeof output.value === 'number') {
        bufferWriter.writeUInt64(output.value);
      } else {
        bufferWriter.writeSlice(output.value);
      }
      bufferWriter.writeVarSlice(output.script);

      return this.getBlake2bHash(bufferWriter.buffer, 'ZcashOutputsHash');
    }
    return Transaction.ZERO;
  }

  private getBlake2bHash(bufferToHash: Buffer, personalization: string | Buffer): Buffer {
    const out = Buffer.allocUnsafe(32);
    return blake2b(out.length, null, null, Buffer.from(personalization)).update(bufferToHash).digest(out);
  }

  private varSliceSize(someScript: Buffer): number {
    const length = someScript.length;
    return varuint.encodingLength(length) + length;
  }
}