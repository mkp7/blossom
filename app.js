const util = require('util')
const mmh3 = require('murmurhash3')
const murmur32 = util.promisify(mmh3.murmur32)

const byteArr = Buffer.alloc(10)
const hashCount = 2

function add (byteArr, key, hashCount, cb) {
  for (let i = 0; i < hashCount; i++) {
    murmur32(key, i)
      .then(hashValue => {
        const bitIndex = (hashValue % 10 * 8)
        const byteIndex = parseInt(bitIndex / 8)
        const byte = byteArr[byteIndex]
        const bitVal = (1 << (7 - (bitIndex % 8)))
        byteArr.writeUInt8(byte | bitVal, byteIndex)
        if (i === hashCount - 1) {
          cb()
        }
      })
      .catch(err => { throw err })
  }
}

function check (byteArr, key, hashCount, cb) {
  let present = 0
  for (let i = 0; i < hashCount; i++) {
    murmur32(key, i)
      .then(hashValue => {
        const bitIndex = (hashValue % 10 * 8)
        const byteIndex = parseInt(bitIndex / 8)
        const byte = byteArr[byteIndex]
        const bitVal = (1 << (7 - (bitIndex % 8)))
        if ((byte & bitVal) !== 0) {
          present += 1
        }
        if (i === hashCount - 1) {
          cb(present === hashCount)
        }
      })
      .catch(err => { throw err })
  }
}

add(byteArr, 'mac', hashCount, () => {
  console.log('mac is added')
  check(byteArr, 'mc', hashCount, isThere => (console.log(`mc is present: ${isThere}`)))
  check(byteArr, 'mac', hashCount, isThere => (console.log(`mac is present: ${isThere}`)))
  check(byteArr, 'mca', hashCount, isThere => (console.log(`mca is present: ${isThere}`)))
  check(byteArr, 'mec', hashCount, isThere => (console.log(`mec is present: ${isThere}`)))
})
