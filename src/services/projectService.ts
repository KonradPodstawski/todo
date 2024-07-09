import { supabase } from '../supabase';
import { Project } from '../models/Project';

export class ProjectService {
    private static currentProject: Project | null = null;

    static async getAllProjects(): Promise<Project[]> {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        return data as Project[];
    }

    static async getProjectById(projectId: number): Promise<Project | null> {
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;
        return data as Project;
    }

    static async createProject(project: Project): Promise<Project> {
        const { data, error } = await supabase.from('projects').insert([project]).single();
        if (error) throw error;
        return data as Project;
    }

    static async updateProject(project: Project): Promise<Project> {
        const { data, error } = await supabase.from('projects').update(project).eq('id', project.id).single();
        if (error) throw error;
        return data as Project;
    }

    static async deleteProject(projectId: number): Promise<void> {
        const { error } = await supabase.from('projects').delete().eq('id', projectId);
        if (error) throw error;
    }

    static async setCurrentProject(projectId: number): Promise<void> {
        const project = await this.getProjectById(projectId);
        if (project) {
            this.currentProject = project;
        } else {
            throw new Error('Project not found');
        }
    }

    static getCurrentProject(): Project | null {
        return this.currentProject;
    }
}
