import { defineConfig } from "vite";
import dotenv from "dotenv";

export default defineConfig({
    plugins: [],

    define: {
        "process.env.VITE_SUPABASE_URL": process.env.VITE_SUPABASE_URL,
        "process.env.VITE_SUPABASE_KEY": process.env.VITE_SUPABASE_KEY,
    },
});