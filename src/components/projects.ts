import { ProjectService, Project } from '../services/ProjectService.ts';
import { getNextID } from '../utils/utils.ts';
import { loadStories } from './story.ts';
import { loadUsers } from './task.ts';

export function getProjectHtml() {
  return `
    <div id="project-management">
      <form id="project-form" class="space-y-4">
        <input type="text" id="project-name" placeholder="Project Name" class="border p-2 rounded w-full" />
        <textarea id="project-description" placeholder="Project Description" class="border p-2 rounded w-full"></textarea>
        <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Add Project</button>
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
    await loadStories();
    await loadUsers();
  });

  await loadProjects();
  await loadStories();
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
        </div>
      `).join('');
    }
  }
  
window.editProject = async (id: number) => {
const project = await ProjectService.getById(id);
(document.querySelector<HTMLInputElement>('#project-name')!).value = project.name;
(document.querySelector<HTMLTextAreaElement>('#project-description')!).value = project.description;

document.querySelector<HTMLFormElement>('#project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    project.name = (document.querySelector<HTMLInputElement>('#project-name')!).value;
    project.description = (document.querySelector<HTMLTextAreaElement>('#project-description')!).value;
    await ProjectService.update(project);
    await loadProjects();
});
}

window.deleteProject = async (id: number) => {
await ProjectService.delete(id);
await loadProjects();
}