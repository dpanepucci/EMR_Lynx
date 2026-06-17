import express from 'express'

// Routes
import supabaseTest from './routes/supabaseTest.js'
import supabaseLogin from './routes/login.js'
import supabaseRegister from './routes/register.js'
import supabasePatient from './routes/patient.js'
import chatRoutes from './routes/chat.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.use('/api/supabase', supabaseTest)

app.use('/api/login', supabaseLogin)

app.use('/api/register', supabaseRegister)

app.use('/api/patient', supabasePatient)

app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`)
})
