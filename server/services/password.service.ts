import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

interface PasswordService {
  hashPassword(password: string): string
  comparePasswords(password: string, hashedPassword: string): boolean
}

class PasswordServiceImpl implements PasswordService {
  hashPassword(password: string): string {
    const salt = randomBytes(16)
    const derivedKey = scryptSync(password, salt, 64)
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
  }

  comparePasswords(password: string, hashedPassword: string): boolean {
    const parts = hashedPassword.split(':')
    if (parts.length !== 2) {
      return false
    }

    const [saltHex, keyHex] = parts
    try {
      const salt = Buffer.from(saltHex, 'hex')
      const storedKey = Buffer.from(keyHex, 'hex')
      const derivedKey = scryptSync(password, salt, storedKey.length)

      // timingSafeEqual requires Buffers of the same length
      if (derivedKey.length !== storedKey.length) {
        return false
      }
      return timingSafeEqual(derivedKey, storedKey)
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error comparing passwords', err)
      }
      return false
    }
  }
}

export function getPasswordService(): PasswordService {
  return new PasswordServiceImpl()
}
