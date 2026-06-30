import { Router } from 'express'
import supabase from '../db/supabaseServer.js'
import { buildCometChatUid, ensureCometChatUser } from '../lib/cometchat.js'
import { hashPassword, setAuthCookie, signAuthToken } from '../lib/auth.js'
import { getAllowedRoleCodes, getRoleFromCode } from '../lib/roles.js'

const supabaseRegister = Router()

supabaseRegister.post('/', async (req, res) => {
  const { username, password, role_code, reg_code } = req.body
  const submittedRoleCode = role_code || reg_code
  const role = getRoleFromCode(submittedRoleCode)

  if (!username || !password || !submittedRoleCode) {
    return res.status(400).json({
      ok: false,
      message: 'Username, password, and role code are required.'
    })
  }

  if (!role) {
    return res.status(400).json({
      ok: false,
      message: `Invalid role code. Allowed codes: ${getAllowedRoleCodes().join(', ')}`
    })
  }

  const hashedPassword = await hashPassword(password)

  const { data, error } = await supabase
    .from('login_table')
    .insert([{ username, password: hashedPassword, reg_code: submittedRoleCode }])
    .select()

  if (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }

  const newUser = data?.[0]

  if (!newUser) {
    return res.status(500).json({
      ok: false,
      message: 'Registration succeeded but no user record was returned.'
    })
  }

  const cometchatUid = buildCometChatUid(newUser)

  try {
    await ensureCometChatUser({ uid: cometchatUid, name: newUser.username })
  } catch (cometchatError) {
    await supabase.from('login_table').delete().eq('id', newUser.id)
    return res.status(500).json({
      ok: false,
      message: `Unable to sync user to CometChat: ${cometchatError.message}`
    })
  }

  let token

  try {
    token = signAuthToken({ ...newUser, role })
  } catch (tokenError) {
    await supabase.from('login_table').delete().eq('id', newUser.id)
    return res.status(500).json({
      ok: false,
      message: tokenError.message
    })
  }

  setAuthCookie(res, token)

  return res.status(200).json({
    ok: true,
    message: 'Registration successful.',
    user: {
      id: newUser.id,
      username: newUser.username,
      role,
      cometchat_uid: cometchatUid
    }
  })
})

export default supabaseRegister
