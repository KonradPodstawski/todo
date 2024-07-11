import { ProjectService } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';
import { showStoriesForProject } from './story.ts';
import { loadUsers } from './task.ts';
import { showModal } from './modal.ts';

export function getProjectHtml() {
  return `
    <div id="project-management" class="space-y-4 dark:bg-gray-900 dark:text-white">
      <form id="project-form" class="space-y-4">
        <input type="text" id="project-name" placeholder="Project Name" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
        <textarea id="project-description" placeholder="Project Description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"></textarea>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full dark:bg-blue-400">Add Project</button>
      </form>
      <div id="project-list" class="mt-4"></div>
    </div>
  `;
}

export async function setupProjectManagement() {
  document.querySelector<HTMLFormElement>('#project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.querySelector<HTMLInputElement>('#project-name')!).value;
    const description = (document.querySelector<HTMLTextAreaElement>('#project-description')!).value;
    await ProjectService.create({ id: getNextID(), name, description });
    await loadProjects();
    await loadUsers();
  });

  await loadProjects();
  await loadUsers();
}

async function loadProjects() {
  const projects = await ProjectService.getAll();
  const projectList = document.querySelector<HTMLDivElement>('#project-list');
  if (projectList) {
    projectList.innerHTML = projects.map(p => `
      <div class="border p-2 rounded my-2">
        <h3 class="text-lg">${p.name}</h3>
        <p>${p.description}</p>
        <button class="bg-yellow-500 text-white p-1 rounded mt-2" onclick="editProject(${p.id})">Edit</button>
        <button class="bg-red-600 text-white p-1 rounded mt-2" onclick="deleteProject(${p.id})">Delete</button>
        <button class="bg-blue-600 text-white p-1 rounded mt-2" onclick="infoProject(${p.id})">Info</button>
        <button class="bg-green-600 text-white p-1 rounded mt-2" onclick="selectProject(${p.id})">Select</button>
      </div>
    `).join('');
  }
}

window.editProject = async (id: number) => {
  const project = await ProjectService.getById(id);
  showModal(`
    <h2 class="text-xl mb-4 text-black dark:text-white">Edit Project</h2>
    <form id="modal-project-form" class="space-y-4">
      <input type="text" id="modal-project-name" value="${project.name}" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white" />
      <textarea id="modal-project-description" class="border p-2 rounded w-full dark:bg-gray-700 dark:text-white">${project.description}</textarea>
      <button type="submit" class="bg-blue-600 dark:bg-blue-400 text-white p-2 rounded w-full">Update Project</button>
    </form>
  `);
  
  document.querySelector<HTMLFormElement>('#modal-project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    project.name = (document.querySelector<HTMLInputElement>('#modal-project-name')!).value;
    project.description = (document.querySelector<HTMLTextAreaElement>('#modal-project-description')!).value;
    await ProjectService.update(project);
    document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
    await loadProjects();
  });
}

window.deleteProject = async (id: number) => {
  await ProjectService.delete(id);
  await loadProjects();
}

window.infoProject = async (id: number) => {
  const project = await ProjectService.getById(id);
  showModal(`
    <h2 class="text-xl mb-4">Project Info</h2>
    <p><strong>Name:</strong> ${project.name}</p>
    <p><strong>Description:</strong> ${project.description}</p>
    <button id="modal-close" class="bg-red-500 text-white p-2 rounded mt-4">Close</button>
  `);
  document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
    document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
  });
}

window.selectProject = async (id: number) => {
  document.querySelector<HTMLDivElement>('#project-container')!.classList.add('hidden');
  document.querySelector<HTMLDivElement>('#story-container')!.classList.remove('hidden');
  await showStoriesForProject(id);
}
