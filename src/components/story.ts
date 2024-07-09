import { StoryService, Story } from '../services/StoryService.ts';
import { UserService } from '../services/UserService.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';

export function getStoryHtml() {
  return `
    <div id="story-management" class="my-4 p-4 border rounded">
      <h2 class="text-xl mb-4">Story Management</h2>
      <form id="story-form" class="space-y-4">
        <input type="text" id="story-name" placeholder="Story Name" class="border p-2 rounded w-full" />
        <textarea id="story-description" placeholder="Story Description" class="border p-2 rounded w-full"></textarea>
        <select id="story-priority" class="border p-2 rounded w-full">
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <select id="story-project" class="border p-2 rounded w-full"></select>
        <select id="story-owner" class="border p-2 rounded w-full"></select>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Add Story</button>
      </form>
      <div id="story-list" class="mt-4"></div>
    </div>
  `;
}

export async function setupStoryManagement() {
  document.querySelector<HTMLFormElement>('#story-name')?.addEventListener('mouseover', async (e) => {
    await loadProjects();
  });
  document.querySelector<HTMLFormElement>('#story-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#story-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#story-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#story-priority')!).value as 'niski' | 'średni' | 'wysoki';
    const project_id = parseInt((document.querySelector<HTMLSelectElement>('#story-project')!).value);
    const owner_id = (document.querySelector<HTMLSelectElement>('#story-owner')!).value;
    await StoryService.create({ id: getNextID(), name, description, priority, project_id, created_at: (new Date()).toISOString(), status: 'todo', owner_id });
    await loadProjects();
    await loadOwners();
    await loadStories();
  });

  await loadProjects();
  await loadOwners();
  await loadStories();
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadProjects() {
  const projects = await ProjectService.getAll();
  sleep(1000);
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

export async function loadStories() {
  const stories = await StoryService.getAll();
  const storyList = document.querySelector<HTMLDivElement>('#story-list');
  if (storyList) {
    storyList.innerHTML = stories.map(s => `
      <div class="border p-2 rounded my-2">
        <h3 class="text-lg">${s.name}</h3>
        <p>${s.description}</p>
        <p>Priority: ${s.priority}</p>
        <button class="bg-red-600 text-white p-1 rounded mt-2" onclick="deleteStory(${s.id})">Delete</button>
      </div>
    `).join('');
  }
}

window.deleteStory = async (id: number) => {
  await StoryService.delete(id);
  loadStories();
};
