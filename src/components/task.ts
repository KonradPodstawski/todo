import { TaskService, Task } from '../services/TaskService.ts';
import { StoryService } from '../services/StoryService.ts';
import { UserService } from '../services/UserService.ts';

export function getTaskHtml() {
  return `
    <div id="task-management">
      <form id="task-form" class="space-y-4">
        <input type="text" id="task-name" placeholder="Task Name" class="border p-2 rounded w-full" />
        <textarea id="task-description" placeholder="Task Description" class="border p-2 rounded w-full"></textarea>
        <select id="task-priority" class="border p-2 rounded w-full">
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <select id="task-story" class="border p-2 rounded w-full"></select>
        <input type="text" id="task-estimated-time" placeholder="Estimated Time (e.g., 2h 30m)" class="border p-2 rounded w-full" />
        <select id="task-user" class="border p-2 rounded w-full"></select>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Add Task</button>
      </form>
      <div id="task-list" class="mt-4"></div>
    </div>
  `;
}

export function setupTaskManagement() {
  document.querySelector<HTMLFormElement>('#task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#task-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#task-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#task-priority')!).value as 'niski' | 'średni' | 'wysoki';
    const story_id = parseInt((document.querySelector<HTMLSelectElement>('#task-story')!).value);
    const estimated_time = (document.querySelector<HTMLInputElement>('#task-estimated-time')!).value;
    const responsible_user_id = (document.querySelector<HTMLSelectElement>('#task-user')!).value;
    await TaskService.create({ id: 0, name, description, priority, story_id, estimated_time, status: 'todo', created_at: '', responsible_user_id });
    loadTasks();
  });

  loadStories();
  loadUsers();
  loadTasks();
}

async function loadStories() {
  const stories = await StoryService.getAll();
  const storySelect = document.querySelector<HTMLSelectElement>('#task-story');
  if (storySelect) {
    storySelect.innerHTML = stories.map(story => `<option value="${story.id}">${story.name}</option>`).join('');
  }
}

async function loadUsers() {
  const users = await UserService.getAll();
  const userSelect = document.querySelector<HTMLSelectElement>('#task-user');
  if (userSelect) {
    userSelect.innerHTML = users.map(user => `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`).join('');
  }
}

async function loadTasks() {
  const tasks = await TaskService.getAll();
  const taskList = document.querySelector<HTMLDivElement>('#task-list');
  if (taskList) {
    taskList.innerHTML = tasks.map(t => `<div>${t.name}: ${t.description}</div>`).join('');
  }
}
