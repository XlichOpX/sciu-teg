import CryptoJS from 'crypto-js'
const { SECRET } = process.env

/**
 *  Encrypt function, return an array of WordArray type in the index 0 the string hashed with SHA-256
 *  and the index 1 the hash SHA-256 hashed to hmac-sha512 with secret
 * @param msg String that to hash
 * @returns WordArray[] with hash and hash hashed
 */
export function encrypt(msg: string): string[] {
  if (!SECRET) throw new Error('Not SECRET encrypt eviroment variables configured')
  const k = SECRET
  const hashed = CryptoJS.SHA256(msg).toString()
  const hmached = CryptoJS.HmacSHA256(hashed, k).toString()
  console.log(k)
  // pure text , SECRET text
  return [hashed, hmached]
}

/**
 * Compare function, return true or false between a string and a SHA-256 HASH,
 * @param toCompare string
 * @param msg string
 * @returns Boolean
 */
export function compare(toCompare: string, msg: string): boolean {
  const comparer = encrypt(toCompare)[1]
  return comparer === msg ? (msg === comparer ? true : false) : false
}
