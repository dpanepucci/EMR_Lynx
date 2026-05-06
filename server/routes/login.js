import { Router } from 'express';
import supabase from '../db/supabaseServer.js';

const supabaseLogin = Router();

supabaseLogin.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            ok: false,
            message: 'Username and password are required.',
        });
    }

    const { data, error } = await supabase
        .from('login_table')
        .select('id, username')
        .eq('username', username)
        .eq('password', password)
        .limit(1)
        .maybeSingle();

    if (error) {
        return res.status(400).json({
            ok: false,
            message: 'Login query failed.',
            error: error.message,
        });
    }

    if (!data) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid username or password.',
        });
    }

    return res.json({
        ok: true,
        message: 'Login successful.',
        user: data,
    });
});

export default supabaseLogin;