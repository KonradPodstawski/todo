import { TaskService, Task } from '../services/TaskService.ts';
import { UserService, User } from '../services/UserService.ts';
import { getNextID } from '../utils/utils.ts';
import { showModal } from './modal.ts';

let currentStoryId: number | null = null;

export function getTaskHtml() {
  return `
    <div id="task-management" class="my-4 p-4 border rounded dark:bg-gray-900 dark:text-white">
      <button class="bg-gray-600 dark:bg-gray-800 text-white p-2 rounded mb-4" onclick="showStories()">Back to Stories</button>
      <h2 class="text-xl mb-4">Task Management</h2>
      <form id="task-form" class="space-y-4">
        <input type="text" id="task-name" placeholder="Task Name" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <textarea id="task-description" placeholder="Task Description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"></textarea>
        <select id="task-priority" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">
          <option value="niski">Niski</option>
          <option value="średni">Średni</option>
          <option value="wysoki">Wysoki</option>
        </select>
        <input type="text" id="task-estimated-time" placeholder="Estimated Time (e.g., 2h 30m)" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <select id="task-user" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"></select>
        <button type="submit" class="bg-blue-600 dark:bg-blue-400 text-white p-2 rounded w-full">Add Task</button>
      </form>
      <div id="kanban-board" class="mt-4 flex space-x-4">
        <div id="todo-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">To Do</h3>
          <div id="todo-tasks" class="space-y-2"></div>
        </div>
        <div id="doing-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">Doing</h3>
          <div id="doing-tasks" class="space-y-2"></div>
        </div>
        <div id="done-column" class="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 rounded">
          <h3 class="text-xl mb-4">Done</h3>
          <div id="done-tasks" class="space-y-2"></div>
        </div>
      </div>
    </div>
  `;
}


export async function setupTaskManagement() {
  document.querySelector<HTMLFormElement>('#task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#task-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#task-description')!).value;
    const priority = (document.querySelector<HTMLSelectElement>('#task-priority')!).value as 'niski' | 'średni' | 'wysoki';
    if (!currentStoryId) {
      alert('No story selected');
      return;
    }
    const story_id = currentStoryId;
    const estimated_time = (document.querySelector<HTMLInputElement>('#task-estimated-time')!).value;

    // Validate estimated time
    if (!isValidInterval(estimated_time)) {
      alert('Invalid estimated time format. Use format like "2h 30m".');
      return;
    }

    await TaskService.create({ id: getNextID(), name, description, priority, story_id, estimated_time, status: 'todo', created_at: (new Date()).toISOString(), responsible_user_id: null });
    await loadTasksForStory(story_id);
  });

  await loadUsers();
  if (currentStoryId) {
    await loadTasksForStory(currentStoryId);
  }
}

export async function loadUsers() {
  const users = await UserService.getAll();
  const userSelect = document.querySelector<HTMLSelectElement>('#task-user');
  if (userSelect) {
    userSelect.innerHTML = `<option value="">Unassigned</option>` + users.map(user => `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`).join('');
  }
}

export async function loadTasksForStory(storyId: number) {
  const tasks = await TaskService.getAllByStoryId(storyId);
  const todoTasks = document.querySelector<HTMLDivElement>('#todo-tasks');
  const doingTasks = document.querySelector<HTMLDivElement>('#doing-tasks');
  const doneTasks = document.querySelector<HTMLDivElement>('#done-tasks');

  if (todoTasks) todoTasks.innerHTML = '';
  if (doingTasks) doingTasks.innerHTML = '';
  if (doneTasks) doneTasks.innerHTML = '';

  tasks.forEach(t => {
    const taskHtml = `
    <div class="border p-2 rounded my-2 bg-white dark:bg-gray-800">
      <h3 class="text-lg text-black dark:text-white">${t.name}</h3>
      <p class="text-black dark:text-gray-300">${t.description}</p>
      <p class="text-black dark:text-gray-300">Priority: ${t.priority}</p>
      <button class="bg-yellow-500 dark:bg-yellow-600 text-white p-1 rounded mt-2" onclick="editTask(${t.id})">Edit</button>
      <button class="bg-red-600 dark:bg-red-700 text-white p-1 rounded mt-2" onclick="deleteTask(${t.id})">Delete</button>
      <button class="bg-blue-600 dark:bg-blue-500 text-white p-1 rounded mt-2" onclick="infoTask(${t.id})">Info</button>
    </div>
  `;
  
    if (t.status === 'todo' && todoTasks) {
      todoTasks.innerHTML += taskHtml;
    } else if (t.status === 'doing' && doingTasks) {
      doingTasks.innerHTML += taskHtml;
    } else if (t.status === 'done' && doneTasks) {
      doneTasks.innerHTML += taskHtml;
    }
  });
}

window.editTask = async (id: number) => {
  const task = await TaskService.getById(id);
  showModal(`
    <h2 class="text-xl mb-4 text-black dark:text-white">Edit Task</h2>
    <form id="modal-task-form" class="space-y-4">
        <input type="text" id="modal-task-name" value="${task.name}" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <textarea id="modal-task-description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">${task.description}</textarea>
        <select id="modal-task-priority" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">
          <option value="niski" ${task.priority === 'niski' ? 'selected' : ''}>Niski</option>
          <option value="średni" ${task.priority === 'średni' ? 'selected' : ''}>Średni</option>
          <option value="wysoki" ${task.priority === 'wysoki' ? 'selected' : ''}>Wysoki</option>
        </select>
        <input type="text" id="modal-task-estimated-time" value="${task.estimated_time}" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <select id="modal-task-user" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"></select>
        <select id="modal-task-status" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" ${!task.responsible_user_id ? 'disabled' : ''}>
          <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
          <option value="doing" ${task.status === 'doing' ? 'selected' : ''}>Doing</option>
          <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
        </select>
        <button type="submit" class="bg-blue-600 dark:bg-blue-400 text-white p-2 rounded w-full">Update Task</button>
    </form>
  `);
  
  await loadUsers();
  const userSelect = document.querySelector<HTMLSelectElement>('#modal-task-user');
  if (userSelect) {
    userSelect.innerHTML = `<option value="">Unassigned</option>` + (await UserService.getAll()).map(user => `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`).join('');
  }
  userSelect!.value = task.responsible_user_id || '';
  document.querySelector<HTMLFormElement>('#modal-task-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedTask: Partial<Task> & { id: number } = {
          id: task.id,
          name: (document.querySelector<HTMLInputElement>('#modal-task-name')!).value,
          description: (document.querySelector<HTMLTextAreaElement>('#modal-task-description')!).value,
          priority: (document.querySelector<HTMLSelectElement>('#modal-task-priority')!).value as 'niski' | 'średni' | 'wysoki',
          estimated_time: (document.querySelector<HTMLInputElement>('#modal-task-estimated-time')!).value,
          responsible_user_id: (document.querySelector<HTMLSelectElement>('#modal-task-user')!).value || null,
          status: (document.querySelector<HTMLSelectElement>('#modal-task-status')!).value as 'todo' | 'doing' | 'done',
      };

      // Validate estimated time
      if (!isValidInterval(updatedTask.estimated_time)) {
        alert('Invalid estimated time format. Use format like "2h 30m".');
        return;
      }

      // Automatically move task to 'doing' if responsible user is assigned
      if (updatedTask.responsible_user_id && updatedTask.status === 'todo') {
        updatedTask.status = 'doing';
        updatedTask.start_time = new Date().toISOString();
        updatedTask.end_time = null;
      } else if (updatedTask.status === 'done') {
        updatedTask.end_time = new Date().toISOString();
      } else if (!updatedTask.responsible_user_id) {
        updatedTask.status = 'todo';
        updatedTask.start_time = null;
        updatedTask.end_time = null;
      }

      await TaskService.update(updatedTask);
      document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
      await loadTasksForStory(currentStoryId!);
  });
}

window.deleteTask = async (id: number) => {
  await TaskService.delete(id);
  await loadTasksForStory(currentStoryId!);
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

export async function showTasksForStory(storyId: number) {
  currentStoryId = storyId;
  await loadTasksForStory(storyId);
}

window.showStories = () => {
  document.querySelector<HTMLDivElement>('#task-container')!.classList.add('hidden');
  document.querySelector<HTMLDivElement>('#story-container')!.classList.remove('hidden');
}

function isValidInterval(input: string): boolean {
  const regex = /^(\d+h\s*)?(\d+m\s*)?$/;
  return regex.test(input.trim());
}
