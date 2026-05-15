import { Router } from 'express';
import supabase from '../db/supabaseServer';

const supabaseRegister = Router();

supabaseRegister.post('/', async(req, res) => {
    const { username, password, reg_code } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            ok: false,
            message: 'Username, Password and Registration Code are required',
        });
    }

    const { data, error } = await supabase
        .from('login_table')
        .select('id, username,reg_code')
        .eq('username', username)
        .eq('password', password)
        .eq('reg_code'. reg_code)
        .limit(1)
        .maybeSingle();

    if (error) {
        return res.status(400).json({
            ok: false,
            message: 'Registration query failed.',
            error: error.message,
        });
    }

    if (!data) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid Registration Code.',
        });
    }

    return res.json({
        ok: true,
        message: 'Registration successful.',
        user: data,
    });
});

export default supabaseRegister;