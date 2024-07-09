import { Story } from '../models/story';
import { supabase } from '../supabase';

export class StoryService {
    static async getStoriesByProject(projectId: number): Promise<Story[]> {
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('project_id', projectId);

        if (error) throw error;
        return data as Story[];
    }

    static async createStory(story: Story): Promise<Story> {
        const { data, error } = await supabase
            .from('stories')
            .insert([story])
            .single();

        if (error) throw error;
        return data as Story;
    }

    static async updateStory(story: Story): Promise<Story> {
        const { data, error } = await supabase
            .from('stories')
            .update(story)
            .eq('id', story.id)
            .single();

        if (error) throw error;
        return data as Story;
    }

    static async deleteStory(storyId: number): Promise<void> {
        const { error } = await supabase
            .from('stories')
            .delete()
            .eq('id', storyId);

        if (error) throw error;
    }
}