const mmh3 = require('murmurhash3')

const bitArr = Buffer.alloc(100000)
const hashCount = 23

function hash (key, seed) {
  mmh3.murmur32(key, seed, function (err, hashValue) {
    if (err) throw err
  })
  // return
}

function add (bitArr, key, hashCount) {
  for (let i = 0; i < hashCount; i++) {
    const bitIndex = (hash(key, i) % 100000 * 8) - 1
    const byteIndex = parseInt(bitIndex / 8)
    const byte = bitArr[byteIndex]
    bitArr.writeInt8(byte | (1 << (7 - (bitIndex % 8))), byteIndex)
  }
  return true
}

function check (bitArr, key, hashCount) {
  for (let i = 0; i < hashCount; i++) {
    const bitIndex = (hash(key, i) % 100000 * 8) - 1
    const byteIndex = parseInt(bitIndex / 8)
    const byte = bitArr[byteIndex]
    if ((byte & (1 << (7 - (bitIndex % 8)))) === 0) {
      return false
    }
  }
  return true
}
