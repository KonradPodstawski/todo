import { supabase } from '../supabase.ts';

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: 'niski' | 'średni' | 'wysoki';
  story_id: number;
  estimated_time: string;
  status: 'todo' | 'doing' | 'done';
  created_at: string;
  start_time?: string;
  end_time?: string;
  responsible_user_id?: string;
}

export class TaskService {
  private static table = 'tasks';

  static async getAll(): Promise<Task[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw new Error(error.message);
    return data as Task[];
  }

  static async create(task: Task): Promise<Task> {
    const { data, error } = await supabase.from(this.table).insert(task).single();
    if (error) throw new Error(error.message);
    return data as Task;
  }

  static async update(task: Task): Promise<Task> {
    const { data, error } = await supabase.from(this.table).update(task).eq('id', task.id).single();
    if (error) throw new Error(error.message);
    return data as Task;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
