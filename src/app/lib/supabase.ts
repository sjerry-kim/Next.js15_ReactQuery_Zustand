import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../types_db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
