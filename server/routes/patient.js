import { Router } from "express";
import supabase from "../db/supabaseServer";

const supabasePatient = Router ();

supabasePatient.post('/', async(req, res) => {
    const { name, date_of_birth, room, diagnosis } = res.body;

    const { data, error } = await supabase
    .from('patient')
    .insert([{ name, date_of_birth, room, diagnosis}])
    .select();

    if (error) return res.status(400).json({error: error.message});
    return res.status(200).json(data);
});

export default supabasePatient;