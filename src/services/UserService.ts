import { supabase } from '../supabase.ts';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'devops' | 'developer';
}

export class UserService {
  private static table = 'users';

  static async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw new Error(error.message);
    return data as User[];
  }

  static async getById(id: string): Promise<User> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as User;
  }
}
