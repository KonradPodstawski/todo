import { StoryService, Story } from '../services/StoryService.ts';
import { UserService } from '../services/UserService.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';
import { showModal } from './modal.ts';
import { showTasksForStory } from './task.ts';

let currentProjectId: number | null = null;

export function getStoryHtml() {
  return `
    <div id="story-management" class="my-4 p-4 border rounded dark:bg-gray-900 dark:text-white">
      <button class="bg-gray-600 dark:bg-gray-800 text-white p-2 rounded mb-4" onclick="showProjects()">Back to Projects</button>
      <h2 class="text-xl mb-4">Story Management</h2>
      <form id="story-form" class="space-y-4">
        <input type="text" id="story-name" placeholder="Story Name" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <textarea id="story-description" placeholder="Story Description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"></textarea>
        <select id="story-priority" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <button type="submit" class="bg-blue-600 dark:bg-blue-400 text-white p-2 rounded w-full">Add Story</button>
      </form>
      <div id="kanban-board" class="mt-4 flex space-x-4">
        <div id="todo-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">To Do</h3>
          <div id="todo-stories" class="space-y-2"></div>
        </div>
        <div id="doing-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">Doing</h3>
          <div id="doing-stories" class="space-y-2"></div>
        </div>
        <div id="done-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">Done</h3>
          <div id="done-stories" class="space-y-2"></div>
        </div>
      </div>
    </div>
  `;
}


export async function setupStoryManagement() {
  document.querySelector<HTMLFormElement>('#story-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#story-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#story-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#story-priority')!).value as 'niski' | 'średni' | 'wysoki';
    if (!currentProjectId) {
      alert('No project selected');
      return;
    }
    const project_id = currentProjectId;
    await StoryService.create({ id: getNextID(), name, description, priority, project_id, created_at: (new Date()).toISOString(), status: 'todo', owner_id: null });
    await loadStoriesForProject(project_id);
  });

  await loadProjects();
  await loadOwners();
  if (currentProjectId) {
    await loadStoriesForProject(currentProjectId);
  }
}

export async function loadProjects() {
  const projects = await ProjectService.getAll();
  const projectSelect = document.querySelector<HTMLSelectElement>('#story-project');
  if (projectSelect) {
    projectSelect.innerHTML = projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('');
  }
}

export async function loadOwners() {
  const users = await UserService.getAll();
  const ownerSelect = document.querySelector<HTMLSelectElement>('#story-owner');
  if (ownerSelect) {
    ownerSelect.innerHTML = users.map(user => `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`).join('');
  }
}

export async function loadStoriesForProject(projectId: number) {
  const stories = await StoryService.getAllByProjectId(projectId);
  const todoStories = document.querySelector<HTMLDivElement>('#todo-stories');
  const doingStories = document.querySelector<HTMLDivElement>('#doing-stories');
  const doneStories = document.querySelector<HTMLDivElement>('#done-stories');

  if (todoStories) todoStories.innerHTML = '';
  if (doingStories) doingStories.innerHTML = '';
  if (doneStories) doneStories.innerHTML = '';

  stories.forEach(s => {
    const storyHtml = `
    <div class="border p-2 rounded my-2 bg-white dark:bg-gray-800">
      <h3 class="text-lg text-black dark:text-white">${s.name}</h3>
      <p class="text-black dark:text-gray-300">${s.description}</p>
      <p class="text-black dark:text-gray-300">Priority: ${s.priority}</p>
      <button class="bg-yellow-500 dark:bg-yellow-600 text-white p-1 rounded mt-2" onclick="editStory(${s.id})">Edit</button>
      <button class="bg-red-600 dark:bg-red-700 text-white p-1 rounded mt-2" onclick="deleteStory(${s.id})">Delete</button>
      <button class="bg-blue-600 dark:bg-blue-500 text-white p-1 rounded mt-2" onclick="infoStory(${s.id})">Info</button>
      <button class="bg-green-600 dark:bg-green-500 text-white p-1 rounded mt-2" onclick="selectStory(${s.id})">Select</button>
    </div>
  `;
  
    if (s.status === 'todo' && todoStories) {
      todoStories.innerHTML += storyHtml;
    } else if (s.status === 'doing' && doingStories) {
      doingStories.innerHTML += storyHtml;
    } else if (s.status === 'done' && doneStories) {
      doneStories.innerHTML += storyHtml;
    }
  });
}

window.editStory = async (id: number) => {
  const story = await StoryService.getById(id);
  showModal(`
    <h2 class="text-xl mb-4 text-black dark:text-white">Edit Story</h2>
    <form id="modal-story-form" class="space-y-4">
      <input type="text" id="modal-story-name" value="${story.name}" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
      <textarea id="modal-story-description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">${story.description}</textarea>
      <select id="modal-story-priority" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">
        <option value="niski" ${story.priority === 'niski' ? 'selected' : ''}>Niski</option>
        <option value="średni" ${story.priority === 'średni' ? 'selected' : ''}>Średni</option>
        <option value="wysoki" ${story.priority === 'wysoki' ? 'selected' : ''}>Wysoki</option>
      </select>
      <select id="modal-story-status" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">
        <option value="todo" ${story.status === 'todo' ? 'selected' : ''}>To Do</option>
        <option value="doing" ${story.status === 'doing' ? 'selected' : ''}>Doing</option>
        <option value="done" ${story.status === 'done' ? 'selected' : ''}>Done</option>
      </select>
      <button type="submit" class="bg-blue-600 dark:bg-blue-400 text-white p-2 rounded w-full">Update Story</button>
    </form>
  `);
  
  document.querySelector<HTMLFormElement>('#modal-story-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedStory: Partial<Story> & { id: number } = {
      id: story.id,
      name: (document.querySelector<HTMLInputElement>('#modal-story-name')!).value,
      description: (document.querySelector<HTMLTextAreaElement>('#modal-story-description')!).value,
      priority: (document.querySelector<HTMLSelectElement>('#modal-story-priority')!).value as 'niski' | 'średni' | 'wysoki',
      status: (document.querySelector<HTMLSelectElement>('#modal-story-status')!).value as 'todo' | 'doing' | 'done',
    };
    await StoryService.update(updatedStory);
    document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
    await loadStoriesForProject(currentProjectId!);
  });
}

window.deleteStory = async (id: number) => {
  await StoryService.delete(id);
  await loadStoriesForProject(currentProjectId!);
}

window.infoStory = async (id: number) => {
  const story = await StoryService.getById(id);
  let ownerInfo = "None";
  if (story.owner_id) {
    try {
      const owner = await UserService.getById(story.owner_id);
      ownerInfo = `${owner.first_name} ${owner.last_name}`;
    } catch (error) {
      console.error("Error fetching owner details:", error);
    }
  }
  showModal(`
    <h2 class="text-xl mb-4">Story Info</h2>
    <p><strong>Name:</strong> ${story.name}</p>
    <p><strong>Description:</strong> ${story.description}</p>
    <p><strong>Priority:</strong> ${story.priority}</p>
    <p><strong>Project ID:</strong> ${story.project_id}</p>
    <p><strong>Owner:</strong> ${ownerInfo}</p>
    <p><strong>Created At:</strong> ${story.created_at}</p>
    <p><strong>Status:</strong> ${story.status}</p>
    <button id="modal-close" class="bg-red-500 text-white p-2 rounded mt-4">Close</button>
  `);
  document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
    document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
  });
}

window.selectStory = async (id: number) => {
  document.querySelector<HTMLDivElement>('#story-container')!.classList.add('hidden');
  document.querySelector<HTMLDivElement>('#task-container')!.classList.remove('hidden');
  await showTasksForStory(id);
}

export async function showStoriesForProject(projectId: number) {
  currentProjectId = projectId;
  await loadStoriesForProject(projectId);
}

window.showProjects = () => {
  document.querySelector<HTMLDivElement>('#project-container')!.classList.remove('hidden');
  document.querySelector<HTMLDivElement>('#story-container')!.classList.add('hidden');
}
