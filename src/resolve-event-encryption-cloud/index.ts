//@ts-ignore
import { encrypt as encryptAES256, decrypt as decryptAES256 } from 'aes256'

import { getKey, insertKey, forgetKey, generateKey } from './api'

export const encrypt = async (keySelector: string, data: string): Promise<string> => {
  let keyValue = await getKey(keySelector)
  if (!keyValue) {
    keyValue = generateKey()
    await insertKey(keySelector, keyValue)
  }
  const blob = await encryptAES256(keyValue, data)
  return blob
}

export const decrypt = async (keySelector: string, blob: string): Promise<string | null> => {
  const keyValue = await getKey(keySelector)
  if (keyValue) {
    return decryptAES256(keyValue, blob)
  }
  return null
}

export const forget = (keySelector: string) => forgetKey(keySelector)
