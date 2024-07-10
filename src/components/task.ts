import { TaskService, Task } from '../services/TaskService.ts';
import { StoryService } from '../services/StoryService.ts';
import { UserService, User } from '../services/UserService.ts';
import { getNextID } from '../utils/utils.ts';
import { loadOwners, loadProjects } from './story.ts';
import { showModal } from './modal.ts';

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

export async function setupTaskManagement() {
 document.querySelector<HTMLFormElement>('#task-name')?.addEventListener('mouseover', async (e) => {
    await loadProjects();
    await loadStories();
    await loadTasks();
    await loadOwners();
    await loadStories();
  });
  document.querySelector<HTMLFormElement>('#task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#task-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#task-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#task-priority')!).value as 'niski' | 'średni' | 'wysoki';
    const story_id = parseInt((document.querySelector<HTMLSelectElement>('#task-story')!).value);
    const estimated_time = (document.querySelector<HTMLInputElement>('#task-estimated-time')!).value;
    const responsible_user_id = (document.querySelector<HTMLSelectElement>('#task-user')!).value;
    await TaskService.create({ id: getNextID(), name, description, priority, story_id, estimated_time, status: 'todo', created_at: (new Date()).toISOString(), responsible_user_id });
    await loadProjects();
    await loadStories();
    await loadTasks();
    await loadOwners();
    await loadStories();
  });

  await loadProjects();
  await loadStories();
  await loadTasks();
  await loadOwners();
  await loadStories();
}

export async function loadStories() {
  const stories = await StoryService.getAll();
  const storySelect = document.querySelector<HTMLSelectElement>('#task-story');
  if (storySelect) {
    storySelect.innerHTML = stories.map(story => `<option value="${story.id}">${story.name}</option>`).join('');
  }
}

export async function loadUsers() {
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
      taskList.innerHTML = tasks.map(t => `
        <div class="border p-2 rounded my-2">
          <h3 class="text-lg">${t.name}</h3>
          <p>${t.description}</p>
          <p>Priority: ${t.priority}</p>
          <button class="bg-yellow-500 text-white p-1 rounded mt-2" onclick="editTask(${t.id})">Edit</button>
          <button class="bg-red-600 text-white p-1 rounded mt-2" onclick="deleteTask(${t.id})">Delete</button>
          <button class="bg-blue-600 text-white p-1 rounded mt-2" onclick="infoTask(${t.id})">Info</button>
        </div>
      `).join('');
    }
}

window.editTask = async (id: number) => {
  const task = await TaskService.getById(id);
  showModal(`
      <h2 class="text-xl mb-4">Edit Task</h2>
      <form id="modal-task-form" class="space-y-4">
          <input type="text" id="modal-task-name" value="${task.name}" class="border p-2 rounded w-full" />
          <textarea id="modal-task-description" class="border p-2 rounded w-full">${task.description}</textarea>
          <select id="modal-task-priority" class="border p-2 rounded w-full">
            <option value="niski" ${task.priority === 'niski' ? 'selected' : ''}>Niski</option>
            <option value="średni" ${task.priority === 'średni' ? 'selected' : ''}>Średni</option>
            <option value="wysoki" ${task.priority === 'wysoki' ? 'selected' : ''}>Wysoki</option>
          </select>
          <select id="modal-task-story" class="border p-2 rounded w-full"></select>
          <input type="text" id="modal-task-estimated-time" value="${task.estimated_time}" class="border p-2 rounded w-full" />
          <select id="modal-task-user" class="border p-2 rounded w-full"></select>
          <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Update Task</button>
      </form>
  `);
  await loadStories();
  await loadUsers();
  document.querySelector<HTMLSelectElement>('#modal-task-story')!.value = task.story_id.toString();
  document.querySelector<HTMLSelectElement>('#modal-task-user')!.value = task.responsible_user_id || '';
  document.querySelector<HTMLFormElement>('#modal-task-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedTask: Partial<Task> & { id: number } = {
          id: task.id,
          name: (document.querySelector<HTMLInputElement>('#modal-task-name')!).value,
          description: (document.querySelector<HTMLTextAreaElement>('#modal-task-description')!).value,
          priority: (document.querySelector<HTMLSelectElement>('#modal-task-priority')!).value as 'niski' | 'średni' | 'wysoki',
          estimated_time: (document.querySelector<HTMLInputElement>('#modal-task-estimated-time')!).value,
      };
      const storyIdValue = (document.querySelector<HTMLSelectElement>('#modal-task-story')!).value;
      if (storyIdValue) updatedTask.story_id = parseInt(storyIdValue);
      const userIdValue = (document.querySelector<HTMLSelectElement>('#modal-task-user')!).value;
      if (userIdValue) updatedTask.responsible_user_id = userIdValue;
      await TaskService.update(updatedTask);
      document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
      await loadTasks();
  });
}

window.deleteTask = async (id: number) => {
  await TaskService.delete(id);
  await loadTasks();
}

window.infoTask = async (id: number) => {
  const task = await TaskService.getById(id);
  const responsibleUser = task.responsible_user_id ? await UserService.getById(task.responsible_user_id) : null;
  showModal(`
      <h2 class="text-xl mb-4">Task Info</h2>
      <p><strong>Name:</strong> ${task.name}</p>
      <p><strong>Description:</strong> ${task.description}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Story ID:</strong> ${task.story_id}</p>
      <p><strong>Estimated Time:</strong> ${task.estimated_time}</p>
      <p><strong>Responsible User:</strong> ${responsibleUser ? `${responsibleUser.first_name} ${responsibleUser.last_name}` : 'None'}</p>
      <p><strong>Created At:</strong> ${task.created_at}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      <button id="modal-close" class="bg-red-500 text-white p-2 rounded mt-4">Close</button>
  `);
  document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
      document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
  });
}
