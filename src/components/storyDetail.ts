import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { ProjectService } from '../services/ProjectService';
import { UserService } from '../services/UserService';

export function getStoryDetailHtml() {
    return `
    <div id="story-detail" class="mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Stories</h2>
        <div id="story-list" class="space-y-4"></div>
        <div class="mt-4">
            <input type="text" id="new-story-name" placeholder="Story Name" class="border p-2 rounded w-full"/>
            <input type="text" id="new-story-description" placeholder="Story Description" class="border p-2 rounded w-full mt-2"/>
            <select id="new-story-priority" class="border p-2 rounded w-full mt-2">
                <option value="niski">Low</option>
                <option value="średni">Medium</option>
                <option value="wysoki">High</option>
            </select>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="createStory()">Create Story</button>
        </div>
    </div>
    `;
}

export async function renderStories() {
    const currentProject = ProjectService.getCurrentProject();
    if (!currentProject) return;

    const stories = await StoryService.getStoriesByProject(currentProject.id);
    const storyList = document.getElementById('story-list');
    if (storyList) {
        storyList.innerHTML = stories.map(story => renderStoryItem(story)).join('');
    }
}

function renderStoryItem(story: Story) {
    return `
    <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
        <h3 class="text-xl font-semibold">${story.name}</h3>
        <p class="text-gray-600 mt-2">${story.description}</p>
        <p class="text-sm mt-2"><span class="font-bold">Priority:</span> ${story.priority}</p>
        <p class="text-sm"><span class="font-bold">Status:</span> ${story.status}</p>
        <div class="mt-4 flex justify-between">
            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="editStory(${story.id})">Edit</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onclick="deleteStory(${story.id})">Delete</button>
        </div>
    </div>
    `;
}

async function createStory() {
    const name = (document.getElementById('new-story-name') as HTMLInputElement).value;
    const description = (document.getElementById('new-story-description') as HTMLInputElement).value;
    const priority = (document.getElementById('new-story-priority') as HTMLSelectElement).value;
    const currentProject = ProjectService.getCurrentProject();
    if (name && description && priority && currentProject) {
        await StoryService.createStory(new Story(0, name, description, priority as 'niski' | 'średni' | 'wysoki', currentProject.id, new Date(), 'todo', UserService.getCurrentUser().id));
        renderStories();
    }
}

async function editStory(storyId: number) {
    const story = await StoryService.getStoryById(storyId);
    if (!story) return;

    const newName = prompt('Enter new story name', story.name);
    const newDescription = prompt('Enter new story description', story.description);
    const newPriority = prompt('Enter new story priority (niski, średni, wysoki)', story.priority);

    if (newName && newDescription && newPriority) {
        story.name = newName;
        story.description = newDescription;
        story.priority = newPriority as 'niski' | 'średni' | 'wysoki';
        await StoryService.updateStory(story);
        renderStories();
    }
}

async function deleteStory(storyId: number) {
    if (confirm('Are you sure you want to delete this story?')) {
        await StoryService.deleteStory(storyId);
        renderStories();
    }
}
