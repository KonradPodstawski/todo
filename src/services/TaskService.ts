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

  static async getById(id: number): Promise<Task> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as Task;
  }

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

  static async update(task: Partial<Task> & { id: number }): Promise<Task> {
    const updateData = { ...task };

    // Remove fields if not provided
    if (updateData.responsible_user_id === '') delete updateData.responsible_user_id;
    if (updateData.story_id === null || updateData.story_id === undefined) delete updateData.story_id;

    // Apply constraint logic
    if (updateData.status === 'todo') {
      updateData.start_time = null;
      updateData.end_time = null;
    } else if (updateData.status === 'doing') {
      updateData.start_time = updateData.start_time ?? new Date().toISOString();
      updateData.end_time = null;
    } else if (updateData.status === 'done') {
      updateData.end_time = new Date().toISOString();
    }

    const { data, error } = await supabase.from(this.table).update(updateData).eq('id', task.id).single();
    if (error) throw new Error(error.message);
    return data as Task;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
