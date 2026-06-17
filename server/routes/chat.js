import { Router } from 'express'
import supabase from '../db/supabaseServer.js'
import { buildCometChatUid } from '../lib/cometchat.js'

const chatRoutes = Router()

chatRoutes.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('login_table')
    .select('id, username')
    .order('id', { ascending: true })

  if (error) {
    return res.status(400).json({ ok: false, message: error.message })
  }

  const users = (data || []).map((user) => ({
    id: user.id,
    username: user.username,
    cometchat_uid: buildCometChatUid(user)
  }))

  return res.json({ ok: true, users })
})

export default chatRoutes
