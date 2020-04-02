import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

// import { encrypt, decrypt, forget } from './resolve-event-encryption-cloud'
import { encrypt, decrypt, forget } from './resolve-event-encryption-local'

import assert from 'assert'

const generateIds = (count = 10000): void => {
  let aggregateIds = Array(count)
    .fill(null)
    .map(i => uuidv4())

  const json = JSON.stringify({ aggregateIds })
  fs.writeFileSync('aggregateIds.json', json)
}

const readIds = (path = 'aggregateIds.json'): string[] => {
  const data = fs.readFileSync(path)
  const parsed = JSON.parse(data.toString())
  return parsed.aggregateIds
}
/*

local performance:

10000
encryption time, ms:  153743 (with keys generation)
decryption time, ms:  75331

encryption time, ms:  75187
decryption time, ms:  76490

100
encryption time, ms:  1622 (with keys generation)
decryption time, ms:  782

encryption time, ms:  829
decryption time, ms:  797

*/

const data = 'my-data'

const encrypted: string[] = []

export const execute = async (): Promise<void> => {
  // generateIds(100)

  const aggregateIds = readIds('aggregateIds-100.json')
  console.log(aggregateIds.length)

  const time1 = new Date().getTime()

  for (let i = 0; i < aggregateIds.length; i++) {
    const keySelector = aggregateIds[i]
    const resultEncrypted = await encrypt(keySelector, data)
    encrypted.push(resultEncrypted)
  }

  const time2 = new Date().getTime()
  console.log('encryption time, ms: ', time2 - time1)

  for (let i = 0; i < aggregateIds.length; i++) {
    const keySelector = aggregateIds[i]
    const resultDecrypted = await decrypt(keySelector, encrypted[i])
    assert.equal(resultDecrypted, data)
  }

  const time3 = new Date().getTime()

  console.log('decryption time, ms: ', time3 - time2)

  /*
  for (let i = 0; i < aggregateIds.length; i++) {
    await forget(aggregateIds[i])
  }
  */

  // await test('00000000-0000-0000-0000-000000000001')
}

execute()
