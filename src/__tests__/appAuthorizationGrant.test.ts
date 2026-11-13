import { deriveAppAuthorizationGrantID } from "../pbaas/AppAuthorizationGrant";
import { toBase58Check } from "../utils/address";
import { I_ADDR_VERSION } from "../constants/vdxf";

const address = (n: number) =>
  toBase58Check(Buffer.alloc(20, n), I_ADDR_VERSION);
const user = { systemID: address(1), identityID: address(2) };
const delegate = { systemID: address(3), identityID: address(4) };
const requestHash = Buffer.from(
  Array.from({ length: 32 }, (_, i) => i)
).toString("hex");
const derive = () =>
  deriveAppAuthorizationGrantID(user, delegate, address(5), requestHash);

// Fixed digest vectors were computed independently with Python hashlib.

test("grant ID matches independent SHA-256 vector with decoded address order and literal domain", () => {
  expect(derive()).toBe(
    "e52659aba454a4e793fa5c2c53f6b4a57a80272ba59a99f8939bb89f580ad983"
  );
});

test("user and signer system bindings change the grant", () => {
  expect(
    deriveAppAuthorizationGrantID(
      { ...user, systemID: address(6) },
      delegate,
      address(5),
      requestHash
    )
  ).not.toBe(derive());
  expect(
    deriveAppAuthorizationGrantID(
      user,
      { ...delegate, identityID: address(6) },
      address(5),
      requestHash
    )
  ).not.toBe(derive());
});

test("rejects malformed hashes and non-identity addresses", () => {
  for (const hash of ["", "00", "g".repeat(64), requestHash + "00"]) {
    expect(() =>
      deriveAppAuthorizationGrantID(user, delegate, address(5), hash)
    ).toThrow();
  }

  expect(() =>
    deriveAppAuthorizationGrantID(
      user,
      delegate,
      toBase58Check(Buffer.alloc(20), 60),
      requestHash
    )
  ).toThrow();
});
