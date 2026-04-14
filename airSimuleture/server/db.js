import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();
const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.SUPABASE_KEY,
);
if (supabase) {
  console.log("✅ DB connected");
}
export default supabase;
