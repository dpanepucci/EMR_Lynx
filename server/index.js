import express from 'express';

// Routes
import supabaseTest from './routes/supabaseTest.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/api/supabase',supabaseTest);

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
