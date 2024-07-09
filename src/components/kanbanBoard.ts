import { TaskService } from '../services/TaskService';
import { ProjectService } from '../services/ProjectService';
import { StoryService } from '../services/StoryService';
import { Task } from '../models/Task';

export function getKanbanBoardHtml() {
    const currentProject = ProjectService.getCurrentProject();
    if (!currentProject) {
        return `<div class="text-center">No project selected</div>`;
    }

    return `
        <div class="bg-gray-200 flex items-center justify-center min-h-screen">
            <div class="text-center relative w-full max-w-3xl">
                <h1 class="text-4xl font-bold text-blue-600">Project: ${currentProject.name}</h1>
                <div id="kanban-board" class="mt-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Todo</h2>
                            <div id="todo-tasks" class="space-y-4"></div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Doing</h2>
                            <div id="doing-tasks" class="space-y-4"></div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800 mb-4">Done</h2>
                            <div id="done-tasks" class="space-y-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function loadKanbanBoard() {
    const currentProject = ProjectService.getCurrentProject();
    if (!currentProject) return;

    const stories = await StoryService.getStoriesByProject(currentProject.id);
    const tasks = await Promise.all(stories.map(story => TaskService.getTasksByStory(story.id))).then(res => res.flat());

    const todoTasks = tasks.filter(task => task.status === 'todo');
    const doingTasks = tasks.filter(task => task.status === 'doing');
    const doneTasks = tasks.filter(task => task.status === 'done');

    const todoContainer = document.getElementById('todo-tasks');
    const doingContainer = document.getElementById('doing-tasks');
    const doneContainer = document.getElementById('done-tasks');

    if (todoContainer) todoContainer.innerHTML = renderTaskList(todoTasks);
    if (doingContainer) doingContainer.innerHTML = renderTaskList(doingTasks);
    if (doneContainer) doneContainer.innerHTML = renderTaskList(doneTasks);
}

function renderTaskList(tasks: Task[]) {
    return tasks.map(task => `
        <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h3 class="text-xl font-semibold">${task.name}</h3>
            <p class="text-gray-600 mt-2">${task.description}</p>
            <p class="text-sm mt-2"><span class="font-bold">Priority:</span> ${task.priority}</p>
            <p class="text-sm"><span class="font-bold">Status:</span> ${task.status}</p>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="viewTaskDetails(${task.id})">View Details</button>
        </div>
    `).join('');
}
