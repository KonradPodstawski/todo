import { supabase } from '../supabase';
import { Task } from '../models/Task';

export class TaskService {
    static async getTasksByStory(storyId: number): Promise<Task[]> {
        const { data, error } = await supabase.from('tasks').select('*').eq('story_id', storyId);
        if (error) throw error;
        return data as Task[];
    }

    static async getTaskById(taskId: number): Promise<Task | null> {
        const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
        if (error) throw error;
        return data as Task;
    }

    static async createTask(task: Task): Promise<Task> {
        const { data, error } = await supabase.from('tasks').insert([task]).single();
        if (error) throw error;
        return data as Task;
    }

    static async updateTask(task: Task): Promise<Task> {
        const { data, error } = await supabase.from('tasks').update(task).eq('id', task.id).single();
        if (error) throw error;
        return data as Task;
    }

    static async deleteTask(taskId: number): Promise<void> {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (error) throw error;
    }
}
