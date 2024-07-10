import { StoryService, Story } from '../services/StoryService.ts';
import { UserService, User } from '../services/UserService.ts';
import { ProjectService } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';
import { showModal } from './modal.ts';

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
    await loadOwners();
  });

  document.querySelector<HTMLFormElement>('#story-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#story-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#story-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#story-priority')!).value as 'niski' | 'średni' | 'wysoki';
    const project_id = parseInt((document.querySelector<HTMLSelectElement>('#story-project')!).value);
    const owner_id = (document.querySelector<HTMLSelectElement>('#story-owner')!).value;
    await StoryService.create({ id: getNextID(), name, description, priority, project_id, created_at: (new Date()).toISOString(), status: 'todo', owner_id });
    await loadStories();
  });

  await loadProjects();
  await loadOwners();
  await loadStories();
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

export async function loadStories() {
  const stories = await StoryService.getAll();
  const storyList = document.querySelector<HTMLDivElement>('#story-list');
  if (storyList) {
    storyList.innerHTML = stories.map(s => `
      <div class="border p-2 rounded my-2">
        <h3 class="text-lg">${s.name}</h3>
        <p>${s.description}</p>
        <p>Priority: ${s.priority}</p>
        <button class="bg-yellow-500 text-white p-1 rounded mt-2" onclick="editStory(${s.id})">Edit</button>
        <button class="bg-red-600 text-white p-1 rounded mt-2" onclick="deleteStory(${s.id})">Delete</button>
        <button class="bg-blue-600 text-white p-1 rounded mt-2" onclick="infoStory(${s.id})">Info</button>
      </div>
    `).join('');
  }
}

window.editStory = async (id: number) => {
  const story = await StoryService.getById(id);
  showModal(`
      <h2 class="text-xl mb-4">Edit Story</h2>
      <form id="modal-story-form" class="space-y-4">
          <input type="text" id="modal-story-name" value="${story.name}" class="border p-2 rounded w-full" />
          <textarea id="modal-story-description" class="border p-2 rounded w-full">${story.description}</textarea>
          <select id="modal-story-priority" class="border p-2 rounded w-full">
            <option value="niski" ${story.priority === 'niski' ? 'selected' : ''}>Niski</option>
            <option value="średni" ${story.priority === 'średni' ? 'selected' : ''}>Średni</option>
            <option value="wysoki" ${story.priority === 'wysoki' ? 'selected' : ''}>Wysoki</option>
          </select>
          <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Update Story</button>
      </form>
  `);
  document.querySelector<HTMLFormElement>('#modal-story-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedStory: Partial<Story> & { id: number } = {
          id: story.id,
          name: (document.querySelector<HTMLInputElement>('#modal-story-name')!).value,
          description: (document.querySelector<HTMLTextAreaElement>('#modal-story-description')!).value,
          priority: (document.querySelector<HTMLSelectElement>('#modal-story-priority')!).value as 'niski' | 'średni' | 'wysoki',
      };
      await StoryService.update(updatedStory);
      document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
      await loadStories();
  });
}

window.deleteStory = async (id: number) => {
  await StoryService.delete(id);
  await loadStories();
}

window.infoStory = async (id: number) => {
  const story = await StoryService.getById(id);
  const owner = await UserService.getById(story.owner_id);
  showModal(`
      <h2 class="text-xl mb-4">Story Info</h2>
      <p><strong>Name:</strong> ${story.name}</p>
      <p><strong>Description:</strong> ${story.description}</p>
      <p><strong>Priority:</strong> ${story.priority}</p>
      <p><strong>Project ID:</strong> ${story.project_id}</p>
      <p><strong>Owner:</strong> ${owner.first_name} ${owner.last_name}</p>
      <p><strong>Created At:</strong> ${story.created_at}</p>
      <p><strong>Status:</strong> ${story.status}</p>
      <button id="modal-close" class="bg-red-500 text-white p-2 rounded mt-4">Close</button>
  `);
  document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
      document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
  });
}
