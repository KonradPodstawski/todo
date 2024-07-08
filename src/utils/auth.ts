import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase.ts';

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function logIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function logOut(): Promise<{ error: AuthError | null }> {
    return await supabase.auth.signOut();
}

export async function getUser() {
    return (await supabase.auth.getUser()).data.user;
}