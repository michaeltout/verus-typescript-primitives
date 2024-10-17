import { Transaction } from "../../../../pbaas/transaction/Transaction";
import { fromASM } from "../../../../utils/script";
import { TRANSACTION_FIXTURES } from '../../../fixtures/transaction';

describe('Transaction', function () {
  function fromRaw (raw) {
    var tx = new Transaction()
    tx.version = raw.version
    tx.locktime = raw.locktime

    raw.ins.forEach(function (txIn, i) {
      var txHash = Buffer.from(txIn.hash, 'hex')
      var scriptSig

      if (txIn.data) {
        scriptSig = Buffer.from(txIn.data, 'hex')
      } else if (txIn.script) {
        scriptSig = fromASM(txIn.script)
      }

      tx.addInput(txHash, txIn.index, txIn.sequence, scriptSig)
    })

    raw.outs.forEach(function (txOut) {
      var script

      if (txOut.data) {
        script = Buffer.from(txOut.data, 'hex')
      } else if (txOut.script) {
        script = fromASM(txOut.script)
      }

      tx.addOutput(script, txOut.value)
    })

    return tx
  }

  describe('fromBuffer/fromHex', function () {
    function importExport (f) {
      var id = f.id || f.hash
      var txHex = f.hex || f.txHex

      it('imports ' + f.description + ' (' + id + ')', function () {
        var actual = Transaction.fromHex(txHex)

        expect(actual.toHex()).toStrictEqual(txHex)
      })
    }

    TRANSACTION_FIXTURES.valid.forEach(importExport)
    TRANSACTION_FIXTURES.hashForSignature.forEach(importExport)

    TRANSACTION_FIXTURES.invalid.fromBuffer.forEach(function (f) {
      it('throws on ' + f.exception, function () {
        expect(function () {
          Transaction.fromHex(f.hex)
        }).toThrow(new RegExp(f.exception))
      })
    })

    it('.version should be interpreted as an int32le', function () {
      var txHex = 'ffffffff0000ffffffff'
      expect(() => Transaction.fromHex(txHex)).toThrow(new Error("Unsupported Zcash transaction version 2147483647"))
    })
  })

  describe('toBuffer/toHex', function () {
    TRANSACTION_FIXTURES.valid.forEach(function (f) {
      it('exports ' + f.description + ' (' + f.id + ')', function () {
        var actual = fromRaw(f.raw)
        expect(actual.toHex()).toStrictEqual(f.hex)
      })
    })

    it('accepts target Buffer and offset parameters', function () {
      var f = TRANSACTION_FIXTURES.valid[0]
      var actual = fromRaw(f.raw)
      var byteLength = actual.byteLength()

      var target = Buffer.alloc(byteLength * 2)
      var a = actual.toBuffer(target, 0)
      var b = actual.toBuffer(target, byteLength)

      expect(byteLength).toStrictEqual(a.length)
      expect(byteLength).toStrictEqual(b.length)
      expect(a.toString('hex')).toBe(f.hex)
      expect(b.toString('hex')).toBe(f.hex)
      expect(a).toStrictEqual(b)
      expect(a).toStrictEqual(target.slice(0, byteLength))
      expect(b).toStrictEqual(target.slice(byteLength))
    })
  })

  describe('weight/virtualSize', function () {
    it('computes virtual size', function () {
      TRANSACTION_FIXTURES.valid.forEach(function (f) {
        var transaction = Transaction.fromHex(f.whex ? f.whex : f.hex)

        expect(transaction.virtualSize()).toStrictEqual(f.virtualSize)
      })
    })
  })

  describe('addInput', function () {
    var prevTxHash
    beforeEach(function () {
      prevTxHash = Buffer.from('ffffffff00ffff000000000000000000000000000000000000000000101010ff', 'hex')
    })

    it('returns an index', function () {
      var tx = new Transaction()
      
      expect(tx.addInput(prevTxHash, 0)).toStrictEqual(0)
      expect(tx.addInput(prevTxHash, 0)).toStrictEqual(1)
    })

    TRANSACTION_FIXTURES.invalid.addInput.forEach(function (f) {
      it('throws on ' + f.exception, function () {
        var tx = new Transaction()
        var hash = Buffer.from(f.hash, 'hex')

        expect(function () {
          tx.addInput(hash, f.index)
        }).toThrow(new RegExp(f.exception))
      })
    })
  })

  describe('addOutput', function () {
    it('returns an index', function () {
      var tx = new Transaction()

      expect(tx.addOutput(Buffer.alloc(0), 0)).toStrictEqual(0)
      expect(tx.addOutput(Buffer.alloc(0), 0)).toStrictEqual(1)
    })
  })

  describe('clone', function () {
    TRANSACTION_FIXTURES.valid.forEach(function (f) {
      var actual, expected

      beforeEach(function () {
        expected = Transaction.fromHex(f.hex)
        actual = expected.clone()
      })

      it('should have value equality', function () {
        expect(actual).toStrictEqual(expected)
      })

      it('should not have reference equality', function () {
        expect(actual).not.toBe(expected)
      })
    })
  })

  describe('getHash/getId', function () {
    function verify (f) {
      it('should return the id for ' + f.id + '(' + f.description + ')', function () {
        var tx = Transaction.fromHex(f.whex || f.hex)

        expect(tx.getHash().toString('hex')).toStrictEqual(f.hash)
        expect(tx.getId()).toStrictEqual(f.id)
      })
    }

    TRANSACTION_FIXTURES.valid.forEach(verify)
  })

  describe('isCoinbase', function () {
    function verify (f) {
      it('should return ' + f.coinbase + ' for ' + f.id + '(' + f.description + ')', function () {
        var tx = Transaction.fromHex(f.hex)

        expect(tx.isCoinbase()).toStrictEqual(f.coinbase)
      })
    }

    TRANSACTION_FIXTURES.valid.forEach(verify)
  })

  describe('hashForSignature', function () {
    TRANSACTION_FIXTURES.hashForSignature.forEach(function (f) {
      it('should return ' + f.hash + ' for ' + (f.description ? ('case "' + f.description + '"') : f.script), function () {
        var tx = Transaction.fromHex(f.txHex)
        var script = fromASM(f.script)

        expect(tx.hashForSignature(f.inIndex, script, f.type).toString('hex')).toStrictEqual(f.hash)
      })
    })
  })
})
