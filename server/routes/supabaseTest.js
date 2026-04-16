import { Router } from 'express';
import supabase from '../db/supabaseServer.js';

const supabaseTest = Router();

supabaseTest.get('/health_check', async (req, res) => {
    const { data, error } = await supabase.from('health_check').select('*');

    if (error) {
        return res.status(400).json({
            ok: false,
            error: error.message,
        });
    }

    return res.json({
        ok: true,
        data,
    });
});

export default supabaseTest;