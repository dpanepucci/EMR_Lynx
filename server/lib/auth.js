import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const BCRYPT_ROUNDS = 10

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, BCRYPT_ROUNDS)
}

export const isBcryptHash = (value) => {
  return typeof value === 'string' && value.startsWith('$2')
}

export const verifyPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) {
    return { isValid: false, needsRehash: false }
  }

  if (isBcryptHash(storedPassword)) {
    const isValid = await bcrypt.compare(plainPassword, storedPassword)
    return { isValid, needsRehash: false }
  }

  const isValid = plainPassword === storedPassword
  return { isValid, needsRehash: isValid }
}

export const signAuthToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET in server environment.')
  }

  return jwt.sign(
    {
      sub: String(user.id),
      username: user.username
    },
    jwtSecret,
    { expiresIn: '7d' }
  )
}
