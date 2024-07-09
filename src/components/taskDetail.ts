import { TaskService } from '../services/TaskService';
import { UserService } from '../services/UserService';
import { Task } from '../models/Task';
import { ProjectService } from '../services/ProjectService';
import { StoryService } from '../services/StoryService';

export async function getTaskDetailHtml(taskId: number) {
    const task = await TaskService.getTaskById(taskId);
    const users = UserService.getAllUsers();
    const currentProject = ProjectService.getCurrentProject();
    const story = await StoryService.getStoryById(task!.storyId);

    if (!task || !currentProject || !story) {
        return `<div class="text-center">Task not found</div>`;
    }

    return `
        <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h3 class="text-xl font-semibold">${task.name}</h3>
            <p class="text-gray-600 mt-2">${task.description}</p>
            <p class="text-sm mt-2"><span class="font-bold">Priority:</span> ${task.priority}</p>
            <p class="text-sm"><span class="font-bold">Status:</span> ${task.status}</p>
            <p class="text-sm"><span class="font-bold">Project:</span> ${currentProject.name}</p>
            <p class="text-sm"><span class="font-bold">Story:</span> ${story.name}</p>
            <p class="text-sm"><span class="font-bold">Created At:</span> ${task.createdAt}</p>
            <p class="text-sm"><span class="font-bold">Start Time:</span> ${task.startTime || 'Not started'}</p>
            <p class="text-sm"><span class="font-bold">End Time:</span> ${task.endTime || 'Not finished'}</p>
            <p class="text-sm"><span class="font-bold">Responsible User:</span> ${task.responsibleUserId ? UserService.getUserById(task.responsibleUserId)?.firstName : 'Not assigned'}</p>
            
            <div class="mt-4">
                <label for="assign-user" class="block text-sm font-medium text-gray-700">Assign User</label>
                <select id="assign-user" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    ${users.map(user => `<option value="${user.id}" ${task.responsibleUserId === user.id ? 'selected' : ''}>${user.firstName} ${user.lastName} (${user.role})</option>`).join('')}
                </select>
                <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="assignUser(${task.id})">Assign</button>
            </div>

            <div class="mt-4">
                <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onclick="markAsDone(${task.id})">Mark as Done</button>
            </div>
        </div>
    `;
}

export async function assignUser(taskId: number) {
    const userId = (document.getElementById('assign-user') as HTMLSelectElement).value;
    const task = await TaskService.getTaskById(taskId);

    if (!task) return;

    task.responsibleUserId = userId;
    task.status = 'doing';
    task.startTime = new Date();

    await TaskService.updateTask(task);
    alert('User assigned and task status updated to "doing".');
}

export async function markAsDone(taskId: number) {
    const task = await TaskService.getTaskById(taskId);

    if (!task) return;

    task.status = 'done';
    task.endTime = new Date();

    await TaskService.updateTask(task);
    alert('Task marked as done.');
}
