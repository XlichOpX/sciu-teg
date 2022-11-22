import { Prisma } from '@prisma/client'
import CryptoJS from 'crypto-js'
const { SECRET } = process.env

/**
 *  Encrypt function, return an array of WordArray type in the index 0 the string hashed with *SHA-256*
 *  and the index 1 the hash *SHA-256* hashed to *hmac-sha512* with secret
 * @param msg String that to hash
 * @returns WordArray[] with hash and hash hashed
 */
export function encrypt(msg: string): string[] {
  if (!SECRET) throw new Error('Not SECRET encrypt environment variables configured')
  const k = SECRET
  const hashed = CryptoJS.SHA256(msg).toString()
  const hmached = CryptoJS.HmacSHA256(hashed, k).toString()
  // pure text , SECRET text
  return [hashed, hmached]
}

/**
 * Compare function, return true or false between a string and a *SHA-256* HASH,
 * @param toCompare string
 * @param msg string
 * @returns Boolean
 */
export function compare(toCompare: string, msg: string): boolean {
  const comparer = encrypt(toCompare)[1]
  return comparer === msg ? (msg === comparer ? true : false) : false
}

export function secretCrypt(secret: Prisma.SecretCreateInput) {
  for (const key in secret) {
    if (Object.prototype.hasOwnProperty.call(secret, key)) {
      const property = secret[key as keyof Prisma.SecretCreateInput]
      if (key.includes('answer')) {
        const encrypted = typeof property === 'string' ? encrypt(property) : []
        secret[key as keyof Prisma.SecretCreateInput] = encrypted[1]
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
