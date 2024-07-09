import { getAuthHtml } from './auth.ts';
import { ProjectService } from '../services/projectService';
import { StoryService } from '../services/storyService';
import { Story } from '../models/story';

export function getTitlePageHtml() {
    return `
    <div class="bg-gray-200 flex items-center justify-center min-h-screen">
        <div class="text-center relative w-full max-w-md">
            ${getAuthHtml()}
            <div id="project-content" class="hidden">
                <h1 class="text-4xl font-bold text-blue-600" id="project-title"></h1>
                <p class="text-lg text-gray-700 mt-4" id="project-description"></p>
                <div id="stories-container"></div>
            </div>
        </div>
    </div>
    `;
}

export function renderProjectContent() {
    const currentProject = ProjectService.getCurrentProject();

    if (!currentProject) return;

    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');

    if (projectTitle) projectTitle.innerText = `Project: ${currentProject.name}`;
    if (projectDescription) projectDescription.innerText = currentProject.description;

    loadStories();
}

export async function loadStories() {
    const storiesContainer = document.getElementById('stories-container');
    if (!storiesContainer) return;

    const currentProject = ProjectService.getCurrentProject();
    if (!currentProject) return;

    try {
        const stories = await StoryService.getStoriesByProject(currentProject.id);
        storiesContainer.innerHTML = renderStories(stories);
    } catch (error) {
        storiesContainer.innerHTML = `<div class="text-red-500">Failed to load stories</div>`;
    }
}

function renderStories(stories: Story[]) {
    const todo = stories.filter(story => story.status === 'todo');
    const doing = stories.filter(story => story.status === 'doing');
    const done = stories.filter(story => story.status === 'done');

    return `
        <div>
            <h2>Todo</h2>
            ${renderStoryList(todo)}
            <h2>Doing</h2>
            ${renderStoryList(doing)}
            <h2>Done</h2>
            ${renderStoryList(done)}
        </div>
    `;
}

function renderStoryList(stories: Story[]) {
    return stories.map(story => `
        <div class="story" data-id="${story.id}">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <p>Priority: ${story.priority}</p>
            <p>Status: ${story.status}</p>
            <button onclick="editStory(${story.id})">Edit</button>
            <button onclick="deleteStory(${story.id})">Delete</button>
        </div>
    `).join('');
}
