import { Router } from 'express'
import supabase from '../db/supabaseServer.js'
import { buildCometChatUid } from '../lib/cometchat.js'
import { hashPassword, signAuthToken, verifyPassword } from '../lib/auth.js'

const supabaseLogin = Router()

supabaseLogin.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Username and password are required.'
    })
  }

  const { data, error } = await supabase
    .from('login_table')
    .select('id, username, password')
    .eq('username', username)
    .limit(1)
    .maybeSingle()

  if (error) {
    return res.status(400).json({
      ok: false,
      message: 'Login query failed.',
      error: error.message
    })
  }

  if (!data) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid username or password.'
    })
  }

  const { isValid, needsRehash } = await verifyPassword(password, data.password)

  if (!isValid) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid username or password.'
    })
  }

  if (needsRehash) {
    const newHash = await hashPassword(password)
    await supabase.from('login_table').update({ password: newHash }).eq('id', data.id)
  }

  let token

  try {
    token = signAuthToken(data)
  } catch (tokenError) {
    return res.status(500).json({
      ok: false,
      message: tokenError.message
    })
  }

  const { password: _password, ...safeUser } = data

  return res.json({
    ok: true,
    message: 'Login successful.',
    token,
    user: {
      ...safeUser,
      cometchat_uid: buildCometChatUid(safeUser)
    }
  })
})

export default supabaseLogin
