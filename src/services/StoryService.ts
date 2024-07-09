import { supabase } from '../supabase.ts';

export interface Story {
  id: number;
  name: string;
  description: string;
  priority: 'niski' | 'średni' | 'wysoki';
  project_id: number;
  created_at: string;
  status: 'todo' | 'doing' | 'done';
  owner_id: string;
}

export class StoryService {
  private static table = 'stories';

  static async getById(id: number): Promise<Story> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return data as Story;
  }

  static async getAll(): Promise<Story[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw new Error(error.message);
    return data as Story[];
  }

  static async create(story: Story): Promise<Story> {
    const { data, error } = await supabase.from(this.table).insert(story).single();
    if (error) throw new Error(error.message);
    return data as Story;
  }

  static async update(story: Story): Promise<Story> {
    const { data, error } = await supabase.from(this.table).update(story).eq('id', story.id).single();
    if (error) throw new Error(error.message);
    return data as Story;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
