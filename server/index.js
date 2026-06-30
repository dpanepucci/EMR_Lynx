import express from 'express'
import cookieParser from 'cookie-parser'

// Routes
import supabaseTest from './routes/supabaseTest.js'
import supabaseLogin from './routes/login.js'
import supabaseRegister from './routes/register.js'
import supabasePatient from './routes/patient.js'
import chatRoutes from './routes/chat.js'
import { requireAuth } from './lib/auth.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.use('/api/supabase', supabaseTest)

app.use('/api/login', supabaseLogin)

app.use('/api/register', supabaseRegister)

app.use('/api/patient', requireAuth, supabasePatient)

app.use('/api/chat', requireAuth, chatRoutes)

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`)
})
