import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import { encrypt, decrypt, forget } from './resolve-event-encryption-cloud'
// import { encrypt, decrypt, forget } from './resolve-event-encryption-local'

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

const data =
  '{"timestamp":1574948745568,"aggregateId":"b9js9t2y03s46shafuf2izsqqov0","aggregateVersion":1,"type":"DEPLOY_COMPLETED","payload":{"name":"my-test","stage":"prod","region":"eu-west-1","userId":"root@resolve.sh","version":"0.0","deploymentId":"b9js9t2y03s46shafuf2izsqqov0"}}'

const encrypted: string[] = []

export const execute = async (): Promise<void> => {
  // generateIds(1000)

  const aggregateIds = readIds('aggregateIds-1000.json')
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

// execute()
