//@ts-ignore
import { encrypt as encryptAES256, decrypt as decryptAES256 } from 'aes256'

import { getKey, insertKey, forgetKey, generateKey } from './api'

type Decryptor = (blob: string) => string

export const encrypt = async (keySelector: string, data: string): Promise<string> => {
  let keyValue = await getKey(keySelector)
  if (!keyValue) {
    keyValue = generateKey()
    await insertKey(keySelector, keyValue)
  }
  const blob = await encryptAES256(keyValue, data)
  return blob
}

export const decrypt = async (keySelector: string): Promise<Decryptor | null> => {
  const keyValue = await getKey(keySelector)
  if (keyValue) {
    return (blob: string) => decryptAES256(keyValue, blob)
  }
  return null
}

export const forget = (keySelector: string) => forgetKey(keySelector)

export const test = async (count: number, data: string): Promise<void> => {
  for (let i = 0; i < count; i++) {
    const blob = await encryptAES256(generateKey(), data)
  }
}
