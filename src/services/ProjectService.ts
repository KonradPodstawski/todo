import { supabase } from '../supabase.ts';

export interface Project {
  id: number;
  name: string;
  description: string;
}

export class ProjectService {
  private static table = 'projects';

  static async getAll(): Promise<Project[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw new Error(error.message);
    return data as Project[];
  }

  static async create(project: Project): Promise<Project> {
    const { data, error } = await supabase.from(this.table).insert(project).single();
    if (error) throw new Error(error.message);
    return data as Project;
  }

  static async update(project: Project): Promise<Project> {
    const { data, error } = await supabase.from(this.table).update(project).eq('id', project.id).single();
    if (error) throw new Error(error.message);
    return data as Project;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
