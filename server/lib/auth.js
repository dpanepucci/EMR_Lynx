import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const BCRYPT_ROUNDS = 10
const AUTH_COOKIE_NAME = 'emr_auth'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

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
      username: user.username,
      role: user.role || null
    },
    jwtSecret,
    { expiresIn: '7d' }
  )
}

export const getAuthCookieName = () => AUTH_COOKIE_NAME

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: TOKEN_TTL_MS
})

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions())
}

export const clearAuthCookie = (res) => {
  const options = getAuthCookieOptions()
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path
  })
}

export const verifyAuthToken = (token) => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET in server environment.')
  }

  return jwt.verify(token, jwtSecret)
}

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME]
  let token = ''

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice('Bearer '.length).trim()
  } else if (cookieToken) {
    token = String(cookieToken).trim()
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Authorization token required.'
    })
  }

  try {
    const payload = verifyAuthToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired token.'
    })
  }
}
