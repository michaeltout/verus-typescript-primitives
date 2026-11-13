import { BN } from "bn.js";
import {
  AuthorizationCredential,
  AuthorizationStorageBindingCredential as Binding,
  AuthorizationStorageKeyCredential as Key,
  deriveAppAuthorizationStorageManifest as manifest,
} from "../pbaas/AuthorizationCredential";
import { Credential } from "../pbaas/Credential";
import { toBase58Check } from "../utils/address";
import { I_ADDR_VERSION } from "../constants/vdxf";
const address = toBase58Check(Buffer.alloc(20, 1), I_ADDR_VERSION);
const binding = () =>
  new Binding({
    version: new BN(1),
    grantID: "aa".repeat(32),
    relationshipIndex: 0,
    storageSystemID: address,
    storageID: address,
    userKeyID: "bb".repeat(20),
    revocationID: address,
    recoveryID: address,
    keyCount: 1,
  });
const key = () =>
  new Key({
    version: new BN(1),
    grantID: "aa".repeat(32),
    relationshipIndex: 0,
    keyIndex: 0,
    keyID: "cc".repeat(20),
  });

// Fixed digest vectors were computed independently with Python hashlib.

test("maximum-width payloads match the shared accounting and generic binary codec", () => {
  const grant = new AuthorizationCredential({
    version: new BN(1),
    flags: new BN(2),
    grantID: "aa".repeat(32),
    signingSystemID: address,
    appID: address,
    delegateID: address,
    originalRevision: {
      lookupHeight: 0xffffffff,
      txid: "bb".repeat(32),
      vout: 0xffffffff,
    },
    storageManifestHash: "cc".repeat(32),
  });
  const header = binding();
  header.data.relationshipIndex = 0xffffffff;
  header.data.keyCount = 0xffffffff;
  const entry = key();
  entry.data.relationshipIndex = 0xffffffff;
  entry.data.keyIndex = 0xffffffff;

  for (const [record, size] of [
    [grant, 373],
    [header, 319],
    [entry, 155],
  ] as const) {
    expect(Buffer.byteLength(JSON.stringify(record.toPayload()))).toBe(size);

    const credential = record.toCredential(address);

    const parsed = new Credential();
    parsed.fromBuffer(credential.toBuffer());
    expect(parsed.credential).toEqual(record.toPayload());
    expect(parsed.scopes).toEqual({});
    expect(() => record.toCredential(address, "é".repeat(257))).toThrow();
  }

  expect(
    AuthorizationCredential.fromPayload(grant.toPayload()).toPayload()
  ).toEqual(grant.toPayload());
  expect(Binding.fromPayload(header.toPayload()).toPayload()).toEqual(
    header.toPayload()
  );
  expect(Key.fromPayload(entry.toPayload()).toPayload()).toEqual(
    entry.toPayload()
  );
});

test("manifest ignores identical duplicate copies and input order", () => {
  expect(manifest([key(), binding(), key()])).toBe(
    manifest([binding(), key()])
  );
  expect(manifest([binding(), key()])).toBe(
    "fbc2e5ed2f8d639148a7bd9a04241334794286be7beb3ea8bda142578b79d2d6"
  );
});

test("manifest rejects missing, conflicting, duplicate authorities and orphan records", () => {
  expect(() => manifest([binding()])).toThrow();
  expect(() => manifest([key()])).toThrow();
  const changed = key();
  changed.data.keyID = "dd".repeat(20);
  expect(() => manifest([binding(), key(), changed])).toThrow();
  changed.data.keyID = binding().data.userKeyID;
  expect(() => manifest([binding(), changed])).toThrow();
  changed.data.keyIndex = 1;
  expect(() => manifest([binding(), changed])).toThrow();
  const otherGrant = key();
  otherGrant.data.grantID = "dd".repeat(32);
  expect(() => manifest([binding(), otherGrant])).toThrow();
});

test("unsupported fields and invalid indices are rejected before serialization", () => {
  expect(() =>
    Binding.fromPayload({ ...binding().toPayload(), permissions: {} })
  ).toThrow();
  const invalid = key();
  invalid.data.keyIndex = 0x100000000;
  expect(() => invalid.toCredential(address)).toThrow();
});

test("generic credential decoding enforces key and empty scopes", () => {
  const generic = binding().toCredential(address);
  expect(Binding.fromCredential(generic, address).toPayload()).toEqual(
    binding().toPayload()
  );
  generic.scopes = { wildcard: true };
  expect(() => Binding.fromCredential(generic, address)).toThrow();
});

test("credential records enforce their supported version ranges", () => {
  for (const record of [binding(), key()]) {
    for (const version of [0, 2, -1, 1.5, NaN]) {
      record.data.version = Number.isInteger(version)
        ? new BN(version)
        : (version as any);
      expect(() => record.toPayload()).toThrow();
    }
  }

  expect(Binding.VERSION_CURRENT.eq(Binding.VERSION_LAST)).toBe(true);
  expect(Key.VERSION_CURRENT.eq(Key.VERSION_LAST)).toBe(true);
});
