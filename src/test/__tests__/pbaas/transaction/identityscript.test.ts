import { Identity, IDENTITY_FLAG_TOKENIZED_CONTROL } from "../../../../pbaas/Identity";
import { OptCCParams } from "../../../../pbaas/OptCCParams";
import { IdentityScript } from "../../../../pbaas/transaction/IdentityScript";
import { IDENTITY_RECOVER_ADDR } from "../../../../utils/cccustom";

describe('Serializes and deserializes SmartTransactionScripts', () => {
  test('(de)serialize a basic identity registration outscript (v1) from daemon', () => {
    const scriptString = "46040300010314a484f66e98c3d787b2ff8854d3ceeb5b61446978150476a348fd730beb2694f54a7114dbf14aa699f9fa150476a348fd730beb2694f54a7114dbf14aa699f9facc4ce304030e0101150476a348fd730beb2694f54a7114dbf14aa699f9fa4c8e010000000000000001143cdad2d09cbc6e164804af104b1f3f56f0d10d78010000001af5b8015c64d39ab44c60ead8317f9f5a9b6c4c0161000076a348fd730beb2694f54a7114dbf14aa699f9fa76a348fd730beb2694f54a7114dbf14aa699f9fa016931943a1979b5e0308a4da1cb62688e6d6433e4501d2c5a474987deee3137144a48978919d7e6a47670501b04030f0101150476a348fd730beb2694f54a7114dbf14aa699f9fa1b0403100101150476a348fd730beb2694f54a7114dbf14aa699f9fa75";
    
    const script = new IdentityScript();
    script.fromBuffer(Buffer.from(scriptString, 'hex'));

    expect(script.toBuffer().toString('hex')).toBe(scriptString);
    expect(script.getIdentity().toJson()).toStrictEqual({
      contentmap: {},
      contentmultimap: {},
      flags: 0,
      minimumsignatures: 1,
      name: 'a',
      parent: 'i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV',
      primaryaddresses: [ 'REpxm9bCLMiHRNVPA9unPBWixie7uHFA5C' ],
      privateaddress: 'zs1dycegwse0x67qvy2fksukcng3ekkgvly2qwjckj8fxraam33xu2y5jyh3yva0e4ywec9quedcud',
      recoveryauthority: 'iEHpmxiynXmwZKNgMm7BpXWP3EqCJt663q',
      revocationauthority: 'iEHpmxiynXmwZKNgMm7BpXWP3EqCJt663q',
      systemid: 'i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV',
      timelock: 0,
      version: 1,
      identityaddress: 'iEHpmxiynXmwZKNgMm7BpXWP3EqCJt663q'
    });
    expect(() => IdentityScript.fromIdentity(script.getIdentity())).toThrowError()
  });

  test('(de)serialize a basic identity registration outscript for a revoked ID', () => {
    const idjson = {
      "contentmap": {
        "53f36cc8554d2a9b1c86e92e77965607e242a513": "6332bd51fca724077577f93ec7eb185a45bd881268e2d9488c9ef087293e5cc4"
      },
      "contentmultimap": {},
      "flags": 0,
      "identityaddress": "i8byHmWFAeFMajYdgrXiQ9qZ1Y9FqxJUx1",
      "minimumsignatures": 1,
      "name": "VerusPay",
      "parent": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "primaryaddresses": [
        "RSunNQqKnSwpNBRd6kcenScuQEFUWgL3bZ"
      ],
      "privateaddress": "zs1wczplx4kegw32h8g0f7xwl57p5tvnprwdmnzmdnsw50chcl26f7tws92wk2ap03ykaq6jyyztfa",
      "recoveryauthority": "i9ps1xDcr7eM66Fko6aTkeuvvBPZFLEXRN",
      "revocationauthority": "i98Mnj1YugaRzoURXt4aRhdqQDu7rML9J5",
      "systemid": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "timelock": 0,
      "version": 3
    }

    const identity = Identity.fromJson(idjson);
    identity.revoke();

    const idscript = IdentityScript.fromIdentity(identity);

    expect(idscript.masterOptCC.destinations.length).toBe(2);
    expect(idscript.masterOptCC.destinations[1].toAddress()).toBe("i9ps1xDcr7eM66Fko6aTkeuvvBPZFLEXRN");
    expect(idscript.paramsOptCC.vdata.length).toBe(2);
  });

  test('(de)serialize a basic identity registration outscript for a revoked ID with tokenized ID control', () => {
    const idjson = {
      "contentmap": {
        "53f36cc8554d2a9b1c86e92e77965607e242a513": "6332bd51fca724077577f93ec7eb185a45bd881268e2d9488c9ef087293e5cc4"
      },
      "contentmultimap": {},
      "flags": 0,
      "identityaddress": "i8byHmWFAeFMajYdgrXiQ9qZ1Y9FqxJUx1",
      "minimumsignatures": 1,
      "name": "VerusPay",
      "parent": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "primaryaddresses": [
        "RSunNQqKnSwpNBRd6kcenScuQEFUWgL3bZ"
      ],
      "privateaddress": "zs1wczplx4kegw32h8g0f7xwl57p5tvnprwdmnzmdnsw50chcl26f7tws92wk2ap03ykaq6jyyztfa",
      "recoveryauthority": "i9ps1xDcr7eM66Fko6aTkeuvvBPZFLEXRN",
      "revocationauthority": "i98Mnj1YugaRzoURXt4aRhdqQDu7rML9J5",
      "systemid": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "timelock": 0,
      "version": 3
    }

    const identity = Identity.fromJson(idjson);
    identity.flags = identity.flags.xor(IDENTITY_FLAG_TOKENIZED_CONTROL);

    const idscript = IdentityScript.fromIdentity(identity);

    expect(idscript.masterOptCC.destinations.length).toBe(3);
    expect(OptCCParams.fromChunk(idscript.paramsOptCC.vdata[2]).destinations[1].toAddress()).toBe(IDENTITY_RECOVER_ADDR);
    expect(OptCCParams.fromChunk(idscript.paramsOptCC.vdata[2]).n.toNumber()).toBe(2);
    expect(idscript.paramsOptCC.vdata.length).toBe(3);
  });

  test('(de)serialize a basic identity registration outscript (v3) from daemon with contentmap', () => {
    const scriptString = "470403000103150438411ff17100e15b6df8dd72fecbe4fa4964dfea15043e006293b9e3341262eed040048d3a2260367f47150445a96c0179cbb19221c0e8625a2ed691d762fd37cc4d360104030e0101150438411ff17100e15b6df8dd72fecbe4fa4964dfea4ce103000000000000000114c165bce63e47698278f859ee75c35c78eb23e8df01000000a6ef9ea235635e328124ff3429db9f9e91b64e2d085665727573506179000113a542e2075696772ee9861c9b2a4d55c86cf353c45c3e2987f09e8c48d9e2681288bd455a18ebc73ef977750724a7fc51bd32633e006293b9e3341262eed040048d3a2260367f4745a96c0179cbb19221c0e8625a2ed691d762fd370176041f9ab6ca1d155ce87a7c677e9e0d16c9846e6ee62db670751f8be3ead27cb740aa7595d0be24b741a9a6ef9ea235635e328124ff3429db9f9e91b64e2d000000001b04030f010115043e006293b9e3341262eed040048d3a2260367f471b0403100101150445a96c0179cbb19221c0e8625a2ed691d762fd3775";

    const script = new IdentityScript();
    script.fromBuffer(Buffer.from(scriptString, 'hex'));

    const idjson = {
      "contentmap": {
        "53f36cc8554d2a9b1c86e92e77965607e242a513": "6332bd51fca724077577f93ec7eb185a45bd881268e2d9488c9ef087293e5cc4"
      },
      "contentmultimap": {},
      "flags": 0,
      "identityaddress": "i8byHmWFAeFMajYdgrXiQ9qZ1Y9FqxJUx1",
      "minimumsignatures": 1,
      "name": "VerusPay",
      "parent": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "primaryaddresses": [
        "RSunNQqKnSwpNBRd6kcenScuQEFUWgL3bZ"
      ],
      "privateaddress": "zs1wczplx4kegw32h8g0f7xwl57p5tvnprwdmnzmdnsw50chcl26f7tws92wk2ap03ykaq6jyyztfa",
      "recoveryauthority": "i9ps1xDcr7eM66Fko6aTkeuvvBPZFLEXRN",
      "revocationauthority": "i98Mnj1YugaRzoURXt4aRhdqQDu7rML9J5",
      "systemid": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "timelock": 0,
      "version": 3
    }

    expect(script.toBuffer().toString('hex')).toBe(scriptString);
    expect(script.getIdentity().toJson()).toStrictEqual(idjson);
    expect(Identity.fromJson(idjson).toBuffer().toString('hex')).toBe(script.getIdentity().toBuffer().toString('hex'));
    expect(IdentityScript.fromIdentity(script.getIdentity()).toBuffer().toString('hex')).toBe(scriptString);
  });

  test('(de)serialize a basic identity registration outscript (v3) from daemon with contentmultimap', () => {
    const scriptString = "4704030001031504dfae84e93ab133b739076354e9fbb2de428872121504dfae84e93ab133b739076354e9fbb2de428872121504dfae84e93ab133b739076354e9fbb2de42887212cc4dbb0604030e01011504dfae84e93ab133b739076354e9fbb2de428872124d65060300000000000000011472aa70e6a4c0d0ff07541c5fbe4f08cacd89d35b01000000a6ef9ea235635e328124ff3429db9f9e91b64e2d0543687269730250d65f0c3aea3fd55eadf3b6f31f123fe8f9dbe001fdda02ab8b7b8b4418de66e611921699a328126461c0e5018443fdc0027b226172746973744e616d65223a20226976616e40222c2022616c62756d4e616d65223a202274657374416c62756d222c202267656e7265223a2022726f636b222c202275726c223a202268747470733a2f2f2f6a756b65626f78222c20226e6574776f726b4964223a2022726f6f6d66756c222c20227369676e6174757265223a20224167586d4567414141554567774c45516a534f4d44477651394f715859433654706d766c536a2b6c596731374d57336161494d3538634539756657376746344a7966364d2f6e4a4a564d3377466f64496d344972622f545565466a654b43616e35673d3d222c2022747261636b73223a205b7b227265736f757263654964223a20223139343564633964717472673231222c20226e616d65223a20225c75303431325c75303433655c75303433665c75303433625c7530343536205c75303431325c75303435365c75303433345c75303433655c75303433665c75303433625c75303434665c75303434315c75303433655c75303433325c7530343330202d205c75303431325c75303433355c75303434315c75303433645c75303433302028436f766572206279204772616e646d615c7320536d757a6929222c20226475726174696f6e223a203234302e3433327d5d2c2022616c62756d436f766572223a207b227265736f757263654964223a20223931647370387471367273713176227d2c20226172746973744c6f676f223a207b227265736f757263654964223a202272326630366267747a6872386276227d2c2022736c65657665446f63756d656e74223a207b227265736f757263654964223a202235706336307773713335337a736d227d2c2022636f70696573536f6c64223a20302c202272656c6561736554696d657374616d70223a202231363832353539323132222c20227072696365223a207b2256414c55223a20312c202255534443223a203230307d7d652741687b7ab1473754858d7b8b10886945eaf801fddc02ab8b7b8b4418de66e611921699a328126461c0e5018445fdc2027b22616c62756d436f766572223a207b227265736f757263654964223a20223931647370387471367273713176227d2c2022616c62756d4e616d65223a202274657374416c62756d3131222c20226172746973744c6f676f223a207b227265736f757263654964223a202272326630366267747a6872386276227d2c20226172746973744e616d65223a20226976616e40222c202267656e7265223a2022726f636b222c20226e6574776f726b4964223a2022726f6f6d66756c222c20227369676e6174757265223a20224167586d4567414141554567774c45516a534f4d44477651394f715859433654706d766c536a2b6c596731374d57336161494d3538634539756657376746344a7966364d2f6e4a4a564d3377466f64496d344972622f545565466a654b43616e35673d3d222c2022736c65657665446f63756d656e74223a207b227265736f757263654964223a202235706336307773713335337a736d227d2c2022747261636b73223a205b7b226475726174696f6e223a203234302e3433322c20226e616d65223a20225c75303431325c75303433655c75303433665c75303433625c7530343536205c75303431325c75303435365c75303433345c75303433655c75303433665c75303433625c75303434665c75303434315c75303433655c75303433325c7530343330202d205c75303431325c75303433355c75303434315c75303433645c75303433302028436f766572206279204772616e646d615c7320536d757a6929222c20227265736f757263654964223a20223139343564633964717472673231227d5d2c202275726c223a202268747470733a2f2f2f6a756b65626f78222c2022636f70696573536f6c64223a20302c202272656c6561736554696d657374616d70223a202231363832353336313730222c20227072696365223a207b2256414c55223a20312c202255534443223a203230307d7d00dfae84e93ab133b739076354e9fbb2de42887212dfae84e93ab133b739076354e9fbb2de4288721200a6ef9ea235635e328124ff3429db9f9e91b64e2d000000001b04030f01011504dfae84e93ab133b739076354e9fbb2de428872121b04031001011504dfae84e93ab133b739076354e9fbb2de4288721275";

    const script = new IdentityScript();
    script.fromBuffer(Buffer.from(scriptString, 'hex'));

    const idjson = {
      "version": 3,
      "flags": 0,
      "primaryaddresses": [
        "RKjVHqM4VF2pCfVcwGzKH7CxvfMUE4H6o8"
      ],
      "minimumsignatures": 1,
      "name": "Chris",
      "identityaddress": "iPsFBfFoCcxtuZNzE8yxPQhXVn4dmytf8j",
      "parent": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "systemid": "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq",
      "contentmap": {
      },
      "contentmultimap": {
        "iAqxJCbv2veLLHGdantvrzJRupyh3dkT6B": [
          {
            "iK7a5JNJnbeuYWVHCDRpJosj3irGJ5Qa8c": "{\"artistName\": \"ivan@\", \"albumName\": \"testAlbum\", \"genre\": \"rock\", \"url\": \"https:///jukebox\", \"networkId\": \"roomful\", \"signature\": \"AgXmEgAAAUEgwLEQjSOMDGvQ9OqXYC6TpmvlSj+lYg17MW3aaIM58cE9ufW7gF4Jyf6M/nJJVM3wFodIm4Irb/TUeFjeKCan5g==\", \"tracks\": [{\"resourceId\": \"1945dc9dqtrg21\", \"name\": \"\\u0412\\u043e\\u043f\\u043b\\u0456 \\u0412\\u0456\\u0434\\u043e\\u043f\\u043b\\u044f\\u0441\\u043e\\u0432\\u0430 - \\u0412\\u0435\\u0441\\u043d\\u0430 (Cover by Grandma\\s Smuzi)\", \"duration\": 240.432}], \"albumCover\": {\"resourceId\": \"91dsp8tq6rsq1v\"}, \"artistLogo\": {\"resourceId\": \"r2f06bgtzhr8bv\"}, \"sleeveDocument\": {\"resourceId\": \"5pc60wsq353zsm\"}, \"copiesSold\": 0, \"releaseTimestamp\": \"1682559212\", \"price\": {\"VALU\": 1, \"USDC\": 200}}"
          }
        ],
        "iChNhyJiQSZ3HumofCBhuASjgupq1m1NgP": [
          {
            "iK7a5JNJnbeuYWVHCDRpJosj3irGJ5Qa8c": "{\"albumCover\": {\"resourceId\": \"91dsp8tq6rsq1v\"}, \"albumName\": \"testAlbum11\", \"artistLogo\": {\"resourceId\": \"r2f06bgtzhr8bv\"}, \"artistName\": \"ivan@\", \"genre\": \"rock\", \"networkId\": \"roomful\", \"signature\": \"AgXmEgAAAUEgwLEQjSOMDGvQ9OqXYC6TpmvlSj+lYg17MW3aaIM58cE9ufW7gF4Jyf6M/nJJVM3wFodIm4Irb/TUeFjeKCan5g==\", \"sleeveDocument\": {\"resourceId\": \"5pc60wsq353zsm\"}, \"tracks\": [{\"duration\": 240.432, \"name\": \"\\u0412\\u043e\\u043f\\u043b\\u0456 \\u0412\\u0456\\u0434\\u043e\\u043f\\u043b\\u044f\\u0441\\u043e\\u0432\\u0430 - \\u0412\\u0435\\u0441\\u043d\\u0430 (Cover by Grandma\\s Smuzi)\", \"resourceId\": \"1945dc9dqtrg21\"}], \"url\": \"https:///jukebox\", \"copiesSold\": 0, \"releaseTimestamp\": \"1682536170\", \"price\": {\"VALU\": 1, \"USDC\": 200}}"
          }
        ]
      },
      "revocationauthority": "iPsFBfFoCcxtuZNzE8yxPQhXVn4dmytf8j",
      "recoveryauthority": "iPsFBfFoCcxtuZNzE8yxPQhXVn4dmytf8j",
      "timelock": 0
    }

    const scriptId = script.getIdentity([["iK7a5JNJnbeuYWVHCDRpJosj3irGJ5Qa8c"], ["iK7a5JNJnbeuYWVHCDRpJosj3irGJ5Qa8c"]]);
    const scriptJson = scriptId.toJson();

    expect(script.toBuffer().toString('hex')).toBe(scriptString);
    expect(Identity.fromJson(scriptJson).toBuffer().toString('hex')).toBe(script.getIdentity().toBuffer().toString('hex'));

    const jsonId = Identity.fromJson(idjson);
    expect(scriptId.toJson()).toStrictEqual(idjson);

    expect(jsonId.content_multimap.toBuffer().toString("hex")).toBe(scriptId.content_multimap.toBuffer().toString('hex'));
    expect(Identity.fromJson(idjson).toBuffer().toString('hex')).toBe(scriptId.toBuffer().toString('hex'));

    const ownScript = IdentityScript.fromIdentity(script.getIdentity());

    expect(ownScript.toBuffer().toString('hex')).toBe(scriptString);
  });
});