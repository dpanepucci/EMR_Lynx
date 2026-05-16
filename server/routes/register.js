import { Router } from 'express';
import supabase from '../db/supabaseServer.js';

const supabaseRegister = Router();

supabaseRegister.post('/', async(req, res) => {
    const { username, password, reg_code } = req.body;

    const { data, error } = await supabase
        .from('login_table')
        .insert([{ username, password, reg_code}])
        .select();


    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
});

export default supabaseRegister;