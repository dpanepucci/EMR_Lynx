import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});