import { Prisma } from '@prisma/client'
import CryptoJS from 'crypto-js'
const { SECRET } = process.env

/**
 *  Encrypt function, return an string hashed with *SHA-256*
 * @param msg String that to hash
 * @returns string with hash
 */
export function encrypt(msg: string): string {
  const hashed = CryptoJS.SHA256(msg).toString()
  // pure text , SECRET text
  return hashed
}
/**
 *  Encrypt function, return an string hashed with *HmacSHA256*
 * @param msg String that to hash with HmacSHA256
 * @returns string with hash hashed
 */
export function encryptToSaveDB(msg: string): string {
  if (!SECRET) throw new Error('Not SECRET encrypt environment variables configured')
  const k = SECRET
  return CryptoJS.HmacSHA256(encrypt(msg), k).toString()
}
/**
 * Compare function, return true or false between a string and a *SHA-256* HASH,
 * @param toCompare string
 * @param encrypted string
 * @returns Boolean
 */
export function compare(toCompare: string, encrypted: string): boolean {
  const comparer = encryptToSaveDB(toCompare)
  return comparer === encrypted
}

export function secretCrypt(secret: Prisma.SecretCreateInput) {
  for (const key in secret) {
    if (Object.prototype.hasOwnProperty.call(secret, key)) {
      const property = secret[key as keyof Prisma.SecretCreateInput]
      if (key.includes('answer')) {
        if (typeof property === 'string') {
          const encrypted = encrypt(property)
          secret[key as keyof Prisma.SecretCreateInput] = encrypted
        }
      }
    }
  }
  return secret
}

/**
 * Hash some string to _RIPEMD160_ and return 10 first characters
 */
export function hashString(msj: string) {
  return CryptoJS.RIPEMD160(msj).toString().slice(0, 10)
}
