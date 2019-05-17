const util = require('util')
const mmh3 = require('murmurhash3')
const murmur32 = util.promisify(mmh3.murmur32)

const bitArr = Buffer.alloc(100000)
const hashCount = 23

function hash (key, seed) {
  mmh3.murmur32(key, seed, function (err, hashValue) {
    if (err) throw err
  })
  // return
}

function add (bitArr, key, hashCount, cb) {
  for (let i = 0; i < hashCount; i++) {
    murmur32(key, i)
      .then(hashValue => {
        const bitIndex = (hashValue % 100000 * 8) - 1
        const byteIndex = parseInt(bitIndex / 8)
        const byte = bitArr[byteIndex]
        const bitVal = (1 << (7 - (bitIndex % 8)))
        bitArr.writeInt8(byte | bitVal, byteIndex)
        if (i === hashCount - 1) {
          console.log('added')
          cb()
        }
      })
      .catch(err => { throw err })
  }
}

function check (bitArr, key, hashCount) {
  for (let i = 0; i < hashCount; i++) {
    murmur32(key, i)
      .then(hashValue => {
        const bitIndex = (hashValue % 100000 * 8) - 1
        const byteIndex = parseInt(bitIndex / 8)
        const byte = bitArr[byteIndex]
        const bitVal = (1 << (7 - (bitIndex % 8)))
        if ((byte & bitVal) === 0) {
          console.log(`${key} is not present`)
        } else {
          console.log(`${key} is present`)
        }
      })
      .catch(err => { throw err })
  }
}

add(bitArr, 'mac', hashCount, () => check(bitArr, 'ma', hashCount))
