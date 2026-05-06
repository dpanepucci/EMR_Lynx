import express from 'express';

// Routes
import supabaseTest from './routes/supabaseTest.js';
import supabaseLogin from './routes/login.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/api/supabase',supabaseTest);

app.use('/api/login', supabaseLogin);

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
