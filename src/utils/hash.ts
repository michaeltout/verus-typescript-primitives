import createHash = require("create-hash");

export const ripemd160 = (data: Buffer): Buffer => {
  return createHash("ripemd160").update(data).digest();
}

export const sha256 = (data: Buffer): Buffer => {
  return createHash("sha256").update(data).digest();
}

export const hash = (...params: Array<Buffer>): Buffer => {
  const _hash = createHash("sha256");

  params.forEach((value) => {
    _hash.update(value)
  })

  return createHash("sha256").update(_hash.digest()).digest();
}

export const hash160 = (data: Buffer): Buffer => {
  return ripemd160(sha256(data));
}

export const hash256 = (data: Buffer): Buffer => {
  return sha256(sha256(data))
}