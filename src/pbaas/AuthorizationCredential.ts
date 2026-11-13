import {
  IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION,
  IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_BINDING,
  IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_KEY,
} from "../vdxf/keys";
import { BigNumber } from "../utils/types/BigNumber";
import {
  rejectUnknownFields,
  decodeFixedLengthHex,
  assertUint32,
  normalizeFixedLengthHex,
} from "../utils/validation";
import { encodeUInt32LE } from "../utils/serialization";
import varuint from "../utils/varuint";
import { decodeDestination } from "../utils/address";
import { I_ADDR_VERSION } from "../constants/vdxf";
import { BN } from "bn.js";
import { hashData } from "../utils/hash";
import { Credential } from "./Credential";

/** Persistent delegation metadata; the containing user identity supplies the user binding. */
export interface AuthorizationCredentialData {
  version: BigNumber;
  flags: BigNumber;
  grantID: string;
  signingSystemID: string;
  appID: string;
  delegateID: string;
  originalRevision: { lookupHeight: number; txid: string; vout: number };
  storageManifestHash?: string;
}

/** One storage relationship and the independent user authorities required to manage it. */
export interface AuthorizationStorageBindingData {
  version: BigNumber;
  grantID: string;
  relationshipIndex: number;
  storageSystemID: string;
  storageID: string;
  userKeyID: string;
  revocationID: string;
  recoveryID: string;
  keyCount: number;
}

/** One app signing authority installed in a storage relationship. */
export interface AuthorizationStorageKeyData {
  version: BigNumber;
  grantID: string;
  relationshipIndex: number;
  keyIndex: number;
  keyID: string;
}

function version(value: BigNumber, first: BigNumber, last: BigNumber): number {
  if (!BN.isBN(value) || value.lt(first) || value.gt(last)) {
    throw new Error("Unsupported credential version");
  }

  return value.toNumber();
}

/** Decode only from a validated generic record; source U/system remains the caller's binding. */
function credentialPayload(record: Credential, expectedKey: string): object {
  decodeDestination(expectedKey, I_ADDR_VERSION);

  if (
    record.credentialKey !== expectedKey ||
    !record.flags.eq(record.calcFlags()) ||
    !record.isValid()
  ) {
    throw new Error("Invalid authorization credential envelope");
  }

  rejectUnknownFields(record.scopes, []);

  return record.credential;
}

/**
 * Typed records use their registered VDXF credential keys by default.
 * Explicit keys remain supported for callers using a separate namespace.
 */
abstract class AuthorizationRecord<T> {
  static VERSION_INVALID = new BN(0);
  static VERSION_FIRST = new BN(1);
  static VERSION_LAST = new BN(1);
  static VERSION_CURRENT = new BN(1);

  constructor(public data: T, private readonly credentialKey: string) {}

  abstract toPayload(): object;

  toCredential(
    credentialKey: string = this.credentialKey,
    label = ""
  ): Credential {
    decodeDestination(credentialKey, I_ADDR_VERSION);

    // Revalidate mutable data before emitting the compact, Core-compatible payload.
    const payload = this.toPayload();

    const record = new Credential({
      version: new BN(Credential.VERSION_CURRENT),
      credentialKey,
      credential: payload,
      scopes: {},
      label,
    });

    // Credential already enforces Core's text bounds during construction.
    if (!record.isValid()) {
      throw new Error("Invalid authorization credential");
    }

    return record;
  }
}

/** The compact field names are a persisted protocol contract, not API field names. */
export class AuthorizationCredential extends AuthorizationRecord<AuthorizationCredentialData> {
  static CREDENTIAL_KEY = IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION.vdxfid;

  static FLAGS_NONE = new BN(0);
  static FLAG_CONTAINS_PERMISSIONS = new BN(1);
  static FLAG_CONTAINS_STORAGE_BINDINGS = new BN(2);

  constructor(data: AuthorizationCredentialData) {
    super(data, AuthorizationCredential.CREDENTIAL_KEY);
    this.toPayload();
  }

  containsPermissions(): boolean {
    return !this.data.flags
      .and(AuthorizationCredential.FLAG_CONTAINS_PERMISSIONS)
      .isZero();
  }

  toPayload(): object {
    const d = this.data;
    rejectUnknownFields(d, [
      "version",
      "flags",
      "grantID",
      "signingSystemID",
      "appID",
      "delegateID",
      "originalRevision",
      "storageManifestHash",
    ]);
    for (const address of [d.signingSystemID, d.appID, d.delegateID]) {
      decodeDestination(address, I_ADDR_VERSION);
    }

    rejectUnknownFields(d.originalRevision, ["lookupHeight", "txid", "vout"]);

    if (
      !BN.isBN(d.flags) ||
      (!d.flags.eq(AuthorizationCredential.FLAGS_NONE) &&
        !d.flags.eq(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)) ||
      !d.flags
        .and(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)
        .isZero() !==
        (d.storageManifestHash !== undefined)
    ) {
      throw new Error("Unsupported or inconsistent authorization flags");
    }

    return {
      v: version(
        d.version,
        AuthorizationCredential.VERSION_FIRST,
        AuthorizationCredential.VERSION_LAST
      ),
      f: d.flags.toNumber(),
      g: normalizeFixedLengthHex(d.grantID, 32),
      s: d.signingSystemID,
      a: d.appID,
      d: d.delegateID,
      o: [
        assertUint32(d.originalRevision.lookupHeight),
        normalizeFixedLengthHex(d.originalRevision.txid, 32),
        assertUint32(d.originalRevision.vout),
      ],
      ...(d.storageManifestHash === undefined
        ? {}
        : { b: normalizeFixedLengthHex(d.storageManifestHash, 32) }),
    };
  }

  static fromCredential(
    record: Credential,
    expectedKey: string = AuthorizationCredential.CREDENTIAL_KEY
  ): AuthorizationCredential {
    return this.fromPayload(credentialPayload(record, expectedKey));
  }

  static fromPayload(payload: any): AuthorizationCredential {
    rejectUnknownFields(payload, ["v", "f", "g", "s", "a", "d", "o", "b"]);

    if (!Array.isArray(payload.o) || payload.o.length !== 3) {
      throw new Error("Invalid original revision");
    }

    return new AuthorizationCredential({
      version: new BN(assertUint32(payload.v)),
      flags: new BN(assertUint32(payload.f)),
      grantID: payload.g,
      signingSystemID: payload.s,
      appID: payload.a,
      delegateID: payload.d,
      originalRevision: {
        lookupHeight: payload.o[0],
        txid: payload.o[1],
        vout: payload.o[2],
      },
      storageManifestHash: payload.b,
    });
  }
}

/** Relationship headers and key records are stored separately to stay below 512 bytes. */
export class AuthorizationStorageBindingCredential extends AuthorizationRecord<AuthorizationStorageBindingData> {
  static CREDENTIAL_KEY =
    IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_BINDING.vdxfid;

  constructor(data: AuthorizationStorageBindingData) {
    super(data, AuthorizationStorageBindingCredential.CREDENTIAL_KEY);
    this.toPayload();
  }

  get recordID(): string {
    return `1:${this.data.relationshipIndex}`;
  }

  toPayload(): object {
    const d = this.data;
    rejectUnknownFields(d, [
      "version",
      "grantID",
      "relationshipIndex",
      "storageSystemID",
      "storageID",
      "userKeyID",
      "revocationID",
      "recoveryID",
      "keyCount",
    ]);

    for (const address of [
      d.storageSystemID,
      d.storageID,
      d.revocationID,
      d.recoveryID,
    ]) {
      decodeDestination(address, I_ADDR_VERSION);
    }

    if (assertUint32(d.keyCount) === 0) {
      throw new Error("Storage requires app keys");
    }

    return {
      v: version(
        d.version,
        AuthorizationStorageBindingCredential.VERSION_FIRST,
        AuthorizationStorageBindingCredential.VERSION_LAST
      ),
      g: normalizeFixedLengthHex(d.grantID, 32),
      i: assertUint32(d.relationshipIndex),
      s: d.storageSystemID,
      d: d.storageID,
      u: normalizeFixedLengthHex(d.userKeyID, 20),
      r: d.revocationID,
      c: d.recoveryID,
      n: d.keyCount,
    };
  }

  static fromCredential(
    record: Credential,
    expectedKey: string = AuthorizationStorageBindingCredential.CREDENTIAL_KEY
  ): AuthorizationStorageBindingCredential {
    return this.fromPayload(credentialPayload(record, expectedKey));
  }

  static fromPayload(p: any): AuthorizationStorageBindingCredential {
    rejectUnknownFields(p, ["v", "g", "i", "s", "d", "u", "r", "c", "n"]);

    return new AuthorizationStorageBindingCredential({
      version: new BN(assertUint32(p.v)),
      grantID: p.g,
      relationshipIndex: p.i,
      storageSystemID: p.s,
      storageID: p.d,
      userKeyID: p.u,
      revocationID: p.r,
      recoveryID: p.c,
      keyCount: p.n,
    });
  }
}

/** Key indices identify semantic records independently of their encrypted stored copies. */
export class AuthorizationStorageKeyCredential extends AuthorizationRecord<AuthorizationStorageKeyData> {
  static CREDENTIAL_KEY =
    IDENTITY_CREDENTIAL_APPLICATION_AUTHORIZATION_STORAGE_KEY.vdxfid;

  constructor(data: AuthorizationStorageKeyData) {
    super(data, AuthorizationStorageKeyCredential.CREDENTIAL_KEY);
    this.toPayload();
  }

  get recordID(): string {
    return `2:${this.data.relationshipIndex}:${this.data.keyIndex}`;
  }

  toPayload(): object {
    const d = this.data;
    rejectUnknownFields(d, [
      "version",
      "grantID",
      "relationshipIndex",
      "keyIndex",
      "keyID",
    ]);

    return {
      v: version(
        d.version,
        AuthorizationStorageKeyCredential.VERSION_FIRST,
        AuthorizationStorageKeyCredential.VERSION_LAST
      ),
      g: normalizeFixedLengthHex(d.grantID, 32),
      i: assertUint32(d.relationshipIndex),
      j: assertUint32(d.keyIndex),
      k: normalizeFixedLengthHex(d.keyID, 20),
    };
  }

  static fromCredential(
    record: Credential,
    expectedKey: string = AuthorizationStorageKeyCredential.CREDENTIAL_KEY
  ): AuthorizationStorageKeyCredential {
    return this.fromPayload(credentialPayload(record, expectedKey));
  }

  static fromPayload(p: any): AuthorizationStorageKeyCredential {
    rejectUnknownFields(p, ["v", "g", "i", "j", "k"]);

    return new AuthorizationStorageKeyCredential({
      version: new BN(assertUint32(p.v)),
      grantID: p.g,
      relationshipIndex: p.i,
      keyIndex: p.j,
      keyID: p.k,
    });
  }
}

export type AuthorizationStorageRecord =
  | AuthorizationStorageBindingCredential
  | AuthorizationStorageKeyCredential;
/** Validate the complete management set, collapse identical copies, and commit canonical bytes. */
export function deriveAppAuthorizationStorageManifest(
  records: AuthorizationStorageRecord[]
): string {
  const unique = new Map<string, AuthorizationStorageRecord>();
  let grant: string;

  // Multiple encrypted copies may describe the same record, but must agree exactly.
  for (const record of records) {
    if (
      !(record instanceof AuthorizationStorageBindingCredential) &&
      !(record instanceof AuthorizationStorageKeyCredential)
    ) {
      throw new Error("Unknown storage record");
    }

    const payload = record.toPayload();
    const currentGrant = normalizeFixedLengthHex(record.data.grantID, 32);

    if (grant !== undefined && grant !== currentGrant) {
      throw new Error("Mixed grant records");
    }

    grant = currentGrant;

    const previous = unique.get(record.recordID);

    if (
      previous &&
      JSON.stringify(previous.toPayload()) !== JSON.stringify(payload)
    ) {
      throw new Error("Conflicting storage record");
    }

    unique.set(record.recordID, record);
  }

  // Sort indices numerically; lexical sorting would place relationship 10 before 2.
  const headers = [...unique.values()]
    .filter(
      (r): r is AuthorizationStorageBindingCredential =>
        r instanceof AuthorizationStorageBindingCredential
    )
    .sort((a, b) => a.data.relationshipIndex - b.data.relationshipIndex);

  const keys = [...unique.values()]
    .filter(
      (r): r is AuthorizationStorageKeyCredential =>
        r instanceof AuthorizationStorageKeyCredential
    )
    .sort(
      (a, b) =>
        a.data.relationshipIndex - b.data.relationshipIndex ||
        a.data.keyIndex - b.data.keyIndex
    );

  if (!headers.length) {
    throw new Error("Empty storage manifest");
  }

  const grouped = new Map<number, AuthorizationStorageKeyCredential[]>();

  for (const key of keys) {
    const group = grouped.get(key.data.relationshipIndex) ?? [];
    group.push(key);
    grouped.set(key.data.relationshipIndex, group);
  }

  // Iterate supplied records rather than trusting potentially huge declared counts.

  // Each relationship and its keys must form a complete, zero-based sequence.
  headers.forEach((header, i) => {
    if (header.data.relationshipIndex !== i) {
      throw new Error("Noncontiguous relationships");
    }

    const group = grouped.get(i) ?? [];

    if (group.length !== header.data.keyCount) {
      throw new Error("Incomplete storage keys");
    }

    const seen = new Set<string>();
    group.forEach((key, j) => {
      const normalized = normalizeFixedLengthHex(key.data.keyID, 20);

      if (
        key.data.keyIndex !== j ||
        seen.has(normalized) ||
        normalized === normalizeFixedLengthHex(header.data.userKeyID, 20)
      ) {
        throw new Error("Invalid storage key assignment");
      }

      seen.add(normalized);
    });
    grouped.delete(i);
  });

  if (grouped.size) {
    throw new Error("Orphan storage keys");
  }

  // Manifest discriminators 1 and 2 are local record types, not VDXF ordinals.

  // Commit decoded address IDs and little-endian indices, excluding JSON/encryption.
  const encoded = [
    ...headers.map(({ data: d }) =>
      Buffer.concat([
        Buffer.from([1]),
        encodeUInt32LE(d.relationshipIndex),
        decodeFixedLengthHex(d.grantID, 32),
        decodeDestination(d.storageSystemID, I_ADDR_VERSION),
        decodeDestination(d.storageID, I_ADDR_VERSION),
        decodeFixedLengthHex(d.userKeyID, 20),
        decodeDestination(d.revocationID, I_ADDR_VERSION),
        decodeDestination(d.recoveryID, I_ADDR_VERSION),
        encodeUInt32LE(d.keyCount),
      ])
    ),
    ...keys.map(({ data: d }) =>
      Buffer.concat([
        Buffer.from([2]),
        encodeUInt32LE(d.relationshipIndex),
        encodeUInt32LE(d.keyIndex),
        decodeFixedLengthHex(d.grantID, 32),
        decodeFixedLengthHex(d.keyID, 20),
      ])
    ),
  ];

  // Length-prefix each record to preserve unambiguous framing across implementations.
  return hashData(
    Buffer.concat([
      Buffer.from("VerusAppAuthorizationStorage/v1\0"),
      varuint.encode(encoded.length, undefined, 0).buffer,
      ...encoded.flatMap((bytes) => [
        varuint.encode(bytes.length, undefined, 0).buffer,
        bytes,
      ]),
    ])
  ).toString("hex");
}

/** Verify the committed set against this grant, including its grant ID. */
export function verifyAppAuthorizationStorageManifest(
  grant: AuthorizationCredential,
  records: AuthorizationStorageRecord[]
): boolean {
  try {
    grant.toPayload();

    if (
      grant.data.flags
        .and(AuthorizationCredential.FLAG_CONTAINS_STORAGE_BINDINGS)
        .isZero()
    ) {
      return records.length === 0;
    }

    if (
      records.some(
        (record) =>
          normalizeFixedLengthHex(record.data.grantID, 32) !==
          normalizeFixedLengthHex(grant.data.grantID, 32)
      )
    ) {
      return false;
    }

    return (
      deriveAppAuthorizationStorageManifest(records) ===
      normalizeFixedLengthHex(grant.data.storageManifestHash, 32)
    );
  } catch {
    return false;
  }
}
