require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
module.exports.supabase = createClient(supabaseUrl, supabaseKey);
