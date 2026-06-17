import { Router } from 'express'
import supabase from '../db/supabaseServer.js'
import { buildCometChatUid, ensureCometChatUser } from '../lib/cometchat.js'

const supabaseRegister = Router()

supabaseRegister.post('/', async (req, res) => {
  const { username, password, reg_code } = req.body

  if (!username || !password || !reg_code) {
    return res.status(400).json({
      ok: false,
      message: 'Username, password, and registration code are required.'
    })
  }

  const { data, error } = await supabase
    .from('login_table')
    .insert([{ username, password, reg_code }])
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

  return res.status(200).json({
    ok: true,
    message: 'Registration successful.',
    user: {
      id: newUser.id,
      username: newUser.username,
      cometchat_uid: cometchatUid
    }
  })
})

export default supabaseRegister
