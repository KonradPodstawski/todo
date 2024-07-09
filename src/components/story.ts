import { StoryService, Story } from '../services/StoryService.ts';
import { UserService } from '../services/UserService.ts';

export function getStoryHtml() {
  return `
    <div id="story-management">
      <form id="story-form" class="space-y-4">
        <input type="text" id="story-name" placeholder="Story Name" class="border p-2 rounded w-full" />
        <textarea id="story-description" placeholder="Story Description" class="border p-2 rounded w-full"></textarea>
        <select id="story-priority" class="border p-2 rounded w-full">
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <select id="story-owner" class="border p-2 rounded w-full"></select>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Add Story</button>
      </form>
      <div id="story-list" class="mt-4"></div>
    </div>
  `;
}

export function setupStoryManagement() {
  document.querySelector<HTMLFormElement>('#story-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#story-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#story-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#story-priority')!).value as 'niski' | 'średni' | 'wysoki';
    const owner_id = (document.querySelector<HTMLSelectElement>('#story-owner')!).value;
    await StoryService.create({ id: 0, name, description, priority, project_id: 1, created_at: '', status: 'todo', owner_id });
    loadStories();
  });

  loadOwners();
  loadStories();
}

async function loadOwners() {
  const users = await UserService.getAll();
  const ownerSelect = document.querySelector<HTMLSelectElement>('#story-owner');
  if (ownerSelect) {
    ownerSelect.innerHTML = users.map(user => `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`).join('');
  }
}

async function loadStories() {
  const stories = await StoryService.getAll();
  const storyList = document.querySelector<HTMLDivElement>('#story-list');
  if (storyList) {
    storyList.innerHTML = stories.map(s => `<div>${s.name}: ${s.description}</div>`).join('');
  }
}
