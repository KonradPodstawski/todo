import { getAuthHtml } from './auth.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { StoryService } from '../services/StoryService.ts';
import { Story } from '../models/Story.ts';

export function getTitlePageHtml() {
    return `
    <div class="bg-gray-200 flex items-center justify-center min-h-screen">
        <div class="text-center relative w-full max-w-3xl">
            ${getAuthHtml()}
            <div id="project-content" class="hidden mt-8">
                <h1 class="text-4xl font-bold text-blue-600" id="project-title"></h1>
                <p class="text-lg text-gray-700 mt-4" id="project-description"></p>
                <div id="stories-container" class="mt-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Todo</h2>
                            <div id="todo-stories" class="space-y-4"></div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Doing</h2>
                            <div id="doing-stories" class="space-y-4"></div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Done</h2>
                            <div id="done-stories" class="space-y-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

export async function renderProjectContent() {
    const currentProject = ProjectService.getCurrentProject();

    if (!currentProject) return;

    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');

    if (projectTitle) projectTitle.innerText = `Project: ${currentProject.name}`;
    if (projectDescription) projectDescription.innerText = currentProject.description;

    await loadStories();
}

export async function loadStories() {
    const storiesContainer = document.getElementById('stories-container');
    if (!storiesContainer) return;

    const currentProject = ProjectService.getCurrentProject();
    if (!currentProject) return;

    try {
        const stories = await StoryService.getStoriesByProject(currentProject.id);
        const todoContainer = document.getElementById('todo-stories');
        const doingContainer = document.getElementById('doing-stories');
        const doneContainer = document.getElementById('done-stories');

        if (todoContainer) todoContainer.innerHTML = renderStoryList(stories.filter(story => story.status === 'todo'));
        if (doingContainer) doingContainer.innerHTML = renderStoryList(stories.filter(story => story.status === 'doing'));
        if (doneContainer) doneContainer.innerHTML = renderStoryList(stories.filter(story => story.status === 'done'));
    } catch (error) {
        storiesContainer.innerHTML = `<div class="text-red-500">Failed to load stories</div>`;
    }
}

function renderStoryList(stories: Story[]) {
    return stories.map(story => `
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
    `).join('');
}
